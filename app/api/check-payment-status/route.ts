import { db } from "@/lib/db";
import { cvTemplates, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const analysisId = req.nextUrl.searchParams.get("analysisId");
  
  let isPaid = false;
  let hasActivePlan = false;

  // 1. Check if templates are unlocked (for specific analysis)
  if (analysisId && analysisId !== "null" && analysisId !== "undefined") {
    const templates = await db.query.cvTemplates.findMany({
      where: eq(cvTemplates.analysisId, analysisId),
    });
    isPaid = templates.some(t => t.isPaid);
  }

  // 2. Check if user has an active paid plan (universal sync)
  if (userId) {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });
    if (user && (user.plan === 'monthly' || user.plan === 'one_time')) {
      hasActivePlan = true;
    }
  }

  return NextResponse.json({ 
    isPaid: isPaid || hasActivePlan,
    hasActivePlan 
  });
}
