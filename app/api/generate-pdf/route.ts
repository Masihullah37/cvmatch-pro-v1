import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { users, cvTemplates, cvGenerations, cvAnalyses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import puppeteer from "puppeteer";
import React from "react";
import { CVRenderer } from "@/components/templates/CVRenderer";
import { pdfHourlyUserLimit, pdfDailyUserLimit, pdfIpLimit } from "@/lib/rate-limit/upstash";
import { getUserPlan } from "@/lib/billing/get-user-plan";
import crypto from "crypto";

// CACHE BUSTER: 2026-05-05-V3
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * PDF GENERATION ROUTE
 */
export async function POST(req: Request) {
  // CRITICAL FIX: Use eval('require') to completely bypass Next.js static analysis for react-dom/server
  const render = eval("require")("react-dom/server").renderToStaticMarkup;

  let browser;
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { templateId, analysisId, templateData } = body;

    if (!templateId || !analysisId) {
      return NextResponse.json({ error: "Missing IDs" }, { status: 400 });
    }

    const template = await db.query.cvTemplates.findFirst({
      where: eq(cvTemplates.id, templateId),
    });

    const analysis = await db.query.cvAnalyses.findFirst({
      where: eq(cvAnalyses.id, analysisId),
    });

    if (!template || !analysis) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    // 1. Permission & Plan check
    const dbUser = userId ? await db.query.users.findFirst({ where: eq(users.clerkId, userId) }) : null;
    const plan = getUserPlan(dbUser);

    if (plan === "free") {
      return NextResponse.json(
        { error: "Téléchargement bloqué. Passez au plan payant.", action: "upgrade" },
        { status: 403 },
      );
    }

    if (plan === "anonymous") {
      return NextResponse.json(
        { error: "Téléchargement bloqué. Connectez-vous.", action: "login" },
        { status: 401 },
      );
    }

    const isPro = plan === "pro";
    
    if (!isPro && !template.isPaid) {
      return NextResponse.json(
        { error: "Débloquez cette analyse pour télécharger le PDF.", action: "unlock" },
        { status: 403 },
      );
    }

    // ✅ Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    const trackingSalt = process.env.TRACKING_SALT || "default_salt";
    const hashedIp = crypto.createHash('sha256').update(ip + trackingSalt).digest('hex');

    if (userId) {
      const [hourly, daily] = await Promise.all([
        pdfHourlyUserLimit.limit(userId),
        pdfDailyUserLimit.limit(userId),
      ]);

      if (!hourly.success || !daily.success) {
        return NextResponse.json(
          { error: "Limite de téléchargement atteinte." },
          { status: 429 },
        );
      }
    } else {
      const ipLimit = await pdfIpLimit.limit(hashedIp);
      if (!ipLimit.success) {
        return NextResponse.json(
          { error: "Limite de téléchargement atteinte pour cette IP." },
          { status: 429 },
        );
      }
    }

    // 2. Browser Launch
    browser = await puppeteer.launch({
      headless: true,
      executablePath: puppeteer.executablePath(),
      timeout: 60000,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--font-render-hinting=none",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    // ✅ Block external trackers to speed up load
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = request.url();
      if (url.includes("google-analytics") || url.includes("clerk")) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    // ✅ Render CV to HTML string
    const displayData = templateData || template.templateData;
    const cvHtml = render(
      React.createElement(CVRenderer, {
        template: { ...template, templateData: displayData },
        analysisData: analysis,
        isPaid: true,
        isPreview: false,
      }),
    );

    const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    html, body {
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        background-color: white;
                    }
                    body {
                        font-family: 'Inter', sans-serif;
                        -webkit-print-color-adjust: exact;
                    }
                    #cv-ready {
                        width: 100%;
                        position: relative;
                    }
                    /* Force the CV component to fill the page regardless of its internal settings */
                    .cv-printable {
                        width: 100% !important;
                        min-height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                    }
                </style>
            </head>
            <body>
                <div id="cv-ready">${cvHtml}</div>
            </body>
            </html>
        `;

    // ✅ Set content and wait for load
    await page.setContent(htmlContent, { waitUntil: "load", timeout: 30000 });

    // Delay for Tailwind and fonts to finish rendering
    await new Promise((r) => setTimeout(r, 2000));

    // ✅ SHRINK TO FIT & FILL WIDTH LOGIC
    await page.evaluate(() => {
      const container = document.getElementById("cv-ready");
      if (!container) return;

      const A4_HEIGHT_PX = 1122; // A4 height at 96dpi
      const contentHeight = container.offsetHeight || container.scrollHeight;

      if (contentHeight > A4_HEIGHT_PX) {
        const scale = (A4_HEIGHT_PX - 1) / contentHeight;
        // Scale vertically and horizontally
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = "top left";
        // CRITICAL: Expand the container width before scaling
        // so that after scaling it equals exactly 100% of the page width
        container.style.width = 100 / scale + "%";
      } else {
        container.style.width = "100%";
      }
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
      preferCSSPageSize: true,
      pageRanges: "1",
    });

    await browser.close();

    return NextResponse.json({
      pdfBase64: Buffer.from(pdfBuffer).toString("base64"),
      fileName: `CV_${template.templateStyle}.pdf`,
    });
  } catch (error: any) {
    if (browser) await browser.close();
    console.error("PDF Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
