import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cvAnalyses, users } from "@/lib/db/schema";
import {
  strictRateLimit,
  paidUserRateLimit,
  dailyRateLimit,
} from "@/lib/rate-limit/upstash";
import { analyzeCV, generateOptimizedCV } from "@/lib/ai/ats-analyzer";
import { parseCVFile } from "@/lib/ai/cv-parser";
import { extractStructuredJobDetails } from "@/lib/utils/scraper";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

const schema = z.object({
  cvUrl: z.string().url(),
  jobDescription: z.string().min(10),
  jobUrl: z.string().optional(),
  guestSessionId: z.string().optional(),
});

// Known bot user-agents
const BOT_PATTERNS = [
  "python-requests",
  "curl",
  "wget",
  "scrapy",
  "httpx",
  "axios",
  "postman",
  "insomnia",
];

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    // ✅ Bot detection — block non-browser clients
    const userAgent = req.headers.get("user-agent") || "";
    const isBot = BOT_PATTERNS.some((p) => userAgent.toLowerCase().includes(p));
    if (isBot) {
      return NextResponse.json(
        { error: "Accès non autorisé." },
        { status: 403 },
      );
    }

    // ✅ Get IP for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous";

    // ✅ Rate limiting — different limits for guest vs paid users
    if (userId) {
      // Paid/logged-in user: 20 scans/hour, 20/day
      const [hourly, daily] = await Promise.all([
        paidUserRateLimit.limit(`paid_${userId}`),
        dailyRateLimit.limit(`daily_user_${userId}`),
      ]);

      if (!hourly.success) {
        return NextResponse.json(
          {
            error: "Limite horaire atteinte. Réessayez dans 1 heure.",
            reset: hourly.reset,
          },
          { status: 429 },
        );
      }

      if (!daily.success) {
        return NextResponse.json(
          {
            error: "Limite quotidienne atteinte. Réessayez demain.",
            reset: daily.reset,
          },
          { status: 429 },
        );
      }
    } else {
      // Guest: 5 scans/hour per IP, 20/day per IP
      const [hourly, daily] = await Promise.all([
        strictRateLimit.limit(`guest_${ip}`),
        dailyRateLimit.limit(`daily_guest_${ip}`),
      ]);

      if (!hourly.success) {
        return NextResponse.json(
          {
            error: "Limite atteinte. Connectez-vous pour plus d'analyses.",
            reset: hourly.reset,
          },
          { status: 429 },
        );
      }

      if (!daily.success) {
        return NextResponse.json(
          {
            error: "Limite quotidienne atteinte.",
            reset: daily.reset,
          },
          { status: 429 },
        );
      }
    }

    // ✅ Content-Type check — must be JSON
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid request format." },
        { status: 400 },
      );
    }

    const body = await req.json();

    // ✅ Validate input strictly
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { cvUrl, jobDescription, jobUrl, guestSessionId } = parsed.data;

    // ✅ Verify CV URL is from your own uploadthing storage only
    const allowedHosts = ["utfs.io", "uploadthing.com", "ufs.sh"];
    const cvHostname = new URL(cvUrl).hostname;
    if (!allowedHosts.some((h) => cvHostname.includes(h))) {
      return NextResponse.json(
        { error: "Source de fichier non autorisée." },
        { status: 400 },
      );
    }

    // ✅ Get user from DB
    let dbUser = null;
    if (userId) {
      dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, userId),
      });
    }

    // Fetch and parse CV
    const response = await fetch(cvUrl);
    const arrayBuffer = await response.arrayBuffer();

    // ✅ File size check — max 10MB
    if (arrayBuffer.byteLength > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 10MB)." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(arrayBuffer);
    const cvText = await parseCVFile(buffer, cvUrl);

    const structuredJobDetails = extractStructuredJobDetails(jobDescription);
    const analysisResult = await analyzeCV(
      cvText,
      jobDescription,
      structuredJobDetails,
    );
    const optimizedData = await generateOptimizedCV(
      cvText,
      jobDescription,
      analysisResult,
      structuredJobDetails,
    );

    //     // Mock data to test the DB insert
    // const analysisResult = { atsScore: 85, scoreBreakdown: {}, flaws: [], suggestions: [], keywordsMissing: [], keywordsFound: [] };
    // const optimizedData = { userName: "Test User", jobTitle: "Developer" };

    // Save to DB
    const [insertedAnalysis] = await db
      .insert(cvAnalyses)
      .values({
        userId: dbUser?.id,
        originalCvUrl: cvUrl,
        jobUrl,
        jobDescription,
        atsScore: analysisResult.atsScore,
        scoreBreakdown: analysisResult.scoreBreakdown,
        flaws: analysisResult.flaws,
        suggestions: analysisResult.suggestions,
        keywordsMissing: analysisResult.keywordsMissing,
        keywordsFound: analysisResult.keywordsFound,
        optimizedData: optimizedData,
        guestSessionId: guestSessionId,
        status: "completed",
        userName: optimizedData.userName,
        jobTitle: optimizedData.jobTitle,
      })
      .returning({ id: cvAnalyses.id });

    // ✅ No template pre-generation here — happens on unlock only
    // --- ADD THIS PART BACK BELOW ---
    // ✅ Pre-generate the 12 templates (including Horizon and Astra)
    // so they are available for the CVRenderer
    // const styles = [
    //   "Horizon",
    //   "Galaxy",
    //   "Eclipse",
    //   "Aether",
    //   "Hyperion",
    //   "Lunar",
    //   "Stellar",
    //   "Solar",
    //   "Nebula",
    //   "Cosmos",
    //   "Astra",
    //   "Europass",
    // ];

    // const templateValues = styles.map((style, index) => ({
    //   analysisId: insertedAnalysis.id,
    //   templateNumber: index + 1,
    //   templateStyle: style,
    //   templateData: optimizedData, // Reuses the AI-generated content
    //   isPaid: false,
    // }));

    // await db.insert(cvTemplates).values(templateValues);
    // // --------------------------------

    // // ✅ Deduction of credit (If you still want to charge per scan)
    // if (userId) {
    //   await db
    //     .update(users)
    //     .set({ credits: sql`${users.credits} - 1` })
    //     .where(eq(users.clerkId, userId));
    // }

    return NextResponse.json({ analysisId: insertedAnalysis.id });
  } catch (error: any) {
    console.error("API /analyze-cv error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 },
    );
  }
}
