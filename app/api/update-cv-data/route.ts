import { db } from "@/lib/db";
import { cvAnalyses, users, cvTemplates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { analysisId, templateId, optimizedData } = await req.json();

    // 1. Get the internal DB user ID from the Clerk ID
    const dbUser = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId)
    });

    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2. Update master analysis JSON
    await db.update(cvAnalyses)
      .set({ optimizedData })
      .where(eq(cvAnalyses.id, analysisId));

    // 3. Update the specific template JSON (if provided)
    if (templateId) {
      await db.update(cvTemplates)
        .set({ templateData: optimizedData })
        .where(eq(cvTemplates.id, templateId));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("SAVE_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}