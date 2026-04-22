import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cvAnalyses } from '@/lib/db/schema';
import { strictRateLimit } from '@/lib/rate-limit/upstash';
import { analyzeCV } from '@/lib/ai/ats-analyzer';
import { parseCVFile } from '@/lib/ai/cv-parser';
import { z } from 'zod';

const schema = z.object({
  cvUrl: z.string().url(),
  jobDescription: z.string().min(10),
  jobUrl: z.string().optional(),
  guestSessionId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const { success, reset } = await strictRateLimit.limit(`analyze_cv_${ip}`);
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { 
        status: 429,
        headers: { 'Retry-After': reset.toString() }
      });
    }

    const body = await req.json();
    const { cvUrl, jobDescription, jobUrl, guestSessionId } = schema.parse(body);

    // Fetch the CV file from Uploadthing URL
    const response = await fetch(cvUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extract text from CV
    const cvText = await parseCVFile(buffer, cvUrl);

    // Analyze with Gemini
    const analysisResult = await analyzeCV(cvText, jobDescription);

    // Save to DB
    const [inserted] = await db.insert(cvAnalyses).values({
      originalCvUrl: cvUrl,
      jobUrl,
      jobDescription,
      atsScore: analysisResult.atsScore,
      scoreBreakdown: analysisResult.scoreBreakdown,
      flaws: analysisResult.flaws,
      suggestions: analysisResult.suggestions,
      keywordsMissing: analysisResult.keywordsMissing,
      keywordsFound: analysisResult.keywordsFound,
      guestSessionId: guestSessionId,
      status: 'completed'
    }).returning({ id: cvAnalyses.id });

    return NextResponse.json({ analysisId: inserted.id });
  } catch (error: any) {
    console.error('API /analyze-cv error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
