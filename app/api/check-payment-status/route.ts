import { db } from "@/lib/db";
import { cvTemplates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const analysisId = req.nextUrl.searchParams.get("analysisId");
  if (!analysisId) return NextResponse.json({ isPaid: false });

  const templates = await db.query.cvTemplates.findMany({
    where: eq(cvTemplates.analysisId, analysisId),
  });

  return NextResponse.json({ isPaid: templates.length > 0 });
}