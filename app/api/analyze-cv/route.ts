import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cvAnalyses, users, cvTemplates } from '@/lib/db/schema';
import { strictRateLimit } from '@/lib/rate-limit/upstash';
import { analyzeCV, generateOptimizedCV } from '@/lib/ai/ats-analyzer';
import { parseCVFile } from '@/lib/ai/cv-parser';
import { extractStructuredJobDetails } from '@/lib/utils/scraper';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { eq, sql } from 'drizzle-orm';
import { getEffectiveCredits } from '@/lib/utils/subscription';

const schema = z.object({
  cvUrl: z.string().url(),
  jobDescription: z.string().min(10),
  jobUrl: z.string().optional(),
  guestSessionId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    // Rate limit check
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const { success: rlSuccess, reset } = await strictRateLimit.limit(`analyze_cv_${ip}`);
    
    if (!rlSuccess) {
      return NextResponse.json({ error: 'Too many requests' }, { 
        status: 429,
        headers: { 'Retry-After': reset.toString() }
      });
    }

    // Credit check for logged in users
    let dbUser = null;
    if (userId) {
      dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, userId)
      });
      
      if (!dbUser || getEffectiveCredits(dbUser) < 1) {
        return NextResponse.json({ 
          error: 'Crédits insuffisants. Veuillez passer à un plan supérieur.' 
        }, { status: 403 });
      }
    }

    const body = await req.json();
    const { cvUrl, jobDescription, jobUrl, guestSessionId } = schema.parse(body);

    // Fetch the CV file
    const response = await fetch(cvUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extract text from CV
    const cvText = await parseCVFile(buffer, cvUrl);

    const structuredJobDetails = extractStructuredJobDetails(jobDescription);

    // 1. AI Analysis (ATS Score)
    const analysisResult = await analyzeCV(cvText, jobDescription, structuredJobDetails);

    // 2. AI Optimization (One-time content generation)
    const optimizedData = await generateOptimizedCV(
      cvText,
      jobDescription,
      analysisResult,
      structuredJobDetails
    );

    // 3. Save Analysis & Master JSON to DB
    const [insertedAnalysis] = await db.insert(cvAnalyses).values({
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
      status: 'completed',
      userName: optimizedData.userName,
      jobTitle: optimizedData.jobTitle,
    }).returning({ id: cvAnalyses.id });

    // 4. Pre-generate the 10 static templates (all reuse the same optimizedData)
    const styles = [
      'Galaxy', 'Eclipse', 'Aether', 'Hyperion', 'Lunar', 
      'Stellar', 'Solar', 'Nebula', 'Cosmos', 'Europass'
    ];

    const templateValues = styles.map((style, index) => ({
      analysisId: insertedAnalysis.id,
      templateNumber: index + 1,
      templateStyle: style,
      templateData: optimizedData,
      isPaid: false, // Will be controlled by subscription/payment status in UI
    }));

    await db.insert(cvTemplates).values(templateValues);

    // 5. Deduct 1 Credit immediately after AI success
    if (userId) {
      await db.update(users)
        .set({ credits: sql`${users.credits} - 1` })
        .where(eq(users.clerkId, userId));
      console.log(`✅ AI Credit deducted for user ${userId}.`);
    }

    return NextResponse.json({ analysisId: insertedAnalysis.id });
  } catch (error: any) {
    console.error('API /analyze-cv error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
