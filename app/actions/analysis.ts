'use server';

import { db } from "@/lib/db";
import { cvAnalyses, cvTemplates, users } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { analyzeCV, extractRawCVData, generateOptimizedCV } from "@/lib/ai/ats-analyzer";
import { parseCVFile } from "@/lib/ai/cv-parser";
import { extractStructuredJobDetails, isUrl, scrapeJobDescription } from "@/lib/utils/scraper";

import { auth } from "@clerk/nextjs/server";
import { eq, sql, and } from "drizzle-orm";
import { getEffectiveCredits, isCreditsExpired } from "@/lib/utils/subscription";

/**
 * RULE: Prevent AI Token Waste
 * performCVAnalysis only extracts raw data and ATS score.
 * AI Resume Generation is a separate paid action.
 */

export async function performCVAnalysis(formData: FormData) {

  const { userId } = await auth();
  let dbUserId: string | null = null;

  if (userId) {
    // Resolve/Sync User only if logged in
    let dbUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId)
    });

    if (!dbUser) {
      const [newUser] = await db.insert(users).values({
        clerkId: userId,
        credits: 0,
      }).returning();
      dbUserId = newUser.id;
    } else {
      dbUserId = dbUser.id;
    }
  }

  const cvFile = formData.get('cvFile') as File | null;
  let jobTitle = formData.get('jobTitle') as string;
  let jobDescription = formData.get('jobDescription') as string;
  const profileDescription = formData.get('profileDescription') as string | null;

  // Validation: We need at least a CV source
  if (!cvFile && !profileDescription) {
    throw new Error("Missing required data: CV file or Profile Description is required.");
  }

  // URL Scraping Logic
  if (jobDescription && isUrl(jobDescription)) {
    console.log("=== DETECTED JOB URL, SCRAPING... ===");
    try {
      const scrapedContent = await scrapeJobDescription(jobDescription);
      console.log(`=== SCRAPING SUCCESS: ${scrapedContent.length} chars extracted ===`);
      console.log("=== SCRAPED PREVIEW ===", scrapedContent.substring(0, 500));
      jobDescription = scrapedContent;
    } catch (err: any) {
      console.warn("=== URL SCRAPING FAILED ===", err.message);
      throw new Error(
        "Impossible d'extraire le contenu de l'URL fournie. Veuillez copier-coller la description du poste manuellement."
      );
    }
  }

  // Fallback for missing job info
  if (!jobTitle || jobTitle.trim() === "") {
    jobTitle = "Optimisation Générale";
  }
  if (!jobDescription || jobDescription.trim() === "") {
    jobDescription = "Profil professionnel général et polyvalent. Optimisation standard basée sur les meilleures pratiques du marché.";
  }

  let cvText = "";

  if (cvFile && cvFile.size > 0) {
    // Option A: Parse CV from file
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    cvText = await parseCVFile(buffer, cvFile.name);
    console.log("=== CV TEXT PARSED FROM FILE ===");
  } else if (profileDescription) {
    // Option B: Use Profile Description directly
    cvText = profileDescription;
    console.log("=== PROFILE DESCRIPTION USED AS SOURCE ===");
  }

  if (!cvText || cvText.trim().length < 50) {
    throw new Error("Input source is too short or could not be parsed. Please provide more details.");
  }

  console.log("Length:", cvText.length);
  console.log("First 300 chars:", cvText.substring(0, 300));

  const structuredJobDetails = extractStructuredJobDetails(jobDescription);
  if (jobTitle === "Optimisation Générale" && structuredJobDetails.title) {
    jobTitle = structuredJobDetails.title;
  }

  // 1. Analyze ATS
  const analysisResult = await analyzeCV(cvText, jobDescription, structuredJobDetails);

  // 2. Extract Raw CV Data (Rule: Never generate AI content for unpaid users)
  const rawData = await extractRawCVData(cvText);

  // 3. Create Analysis Record
  let newAnalysis: typeof cvAnalyses.$inferSelect;
  try {
    const result = await db.insert(cvAnalyses).values({
      userId: dbUserId, // Associate with DB user
      status: 'completed',
      atsScore: Math.round(Number(analysisResult.atsScore) || 0),
      scoreBreakdown: analysisResult.scoreBreakdown,
      flaws: analysisResult.flaws,
      suggestions: analysisResult.suggestions,
      keywordsFound: analysisResult.keywordsFound,
      keywordsMissing: analysisResult.keywordsMissing,
      userName: rawData?.userName || "Candidat",
      jobTitle: jobTitle || "Poste Visé",
      jobDescription: jobDescription,
      optimizedData: {
        ...rawData,
        _originalCvText: cvText, // Store raw text inside JSON to avoid schema changes
      },
    }).returning();
    newAnalysis = result[0];
  } catch (dbError: any) {
    console.error("=== DB INSERT ERROR ===");
    throw new Error(`Database insert failed: ${dbError?.message ?? 'Unknown DB error'}`);
  }

  revalidatePath('/[locale]/results/[id]', 'page');
  return newAnalysis.id;
}

/**
 * RULE: Credit Deduction Logic (Trigger 1)
 * Deducts 1 credit to generate an AI-optimized resume.
 * Incorporates missing points and suggestions into existing content.
 */
export async function generateAIResume(analysisId: string, currentCVData?: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!dbUser) {
    throw new Error("Utilisateur introuvable.");
  }

  if (isCreditsExpired(dbUser)) throw new Error("EXPIRED: Votre plan a expiré.");
  if (getEffectiveCredits(dbUser) < 1) throw new Error("Crédits insuffisants.");

  const analysis = await db.query.cvAnalyses.findFirst({
    where: eq(cvAnalyses.id, analysisId),
  });

  if (!analysis) throw new Error("Analyse introuvable.");

  // 1. Deduct 1 Credit for AI Generation
  await db.update(users)
    .set({ credits: sql`${users.credits} - 1` })
    .where(eq(users.id, dbUser.id));

  // 2. Perform AI Optimization (Include missing points/suggestions to increase score)
  const cvSource = currentCVData ? JSON.stringify(currentCVData) : (analysis.optimizedData as any)?._originalCvText || "";
  const structuredJobDetails = extractStructuredJobDetails(analysis.jobDescription || "");

  const aiResult = await generateOptimizedCV(
    cvSource,
    analysis.jobDescription || "",
    {
      atsScore: analysis.atsScore,
      scoreBreakdown: analysis.scoreBreakdown,
      flaws: analysis.flaws,
      suggestions: analysis.suggestions,
      keywordsMissing: analysis.keywordsMissing,
      keywordsFound: analysis.keywordsFound,
    } as any,
    structuredJobDetails
  );

  // RULE: Prevent AI from adding extra sections not present in user editor
  // If currentCVData is provided, we filter the AI result to match the user's existing sections
  let finalData = aiResult;
  if (currentCVData && typeof aiResult === 'object' && aiResult !== null) {
    const filteredResult: any = {};
    // Only keep keys that existed in the original user data
    Object.keys(currentCVData).forEach(key => {
      // Use AI content if available, otherwise fallback to original
      filteredResult[key] = aiResult[key] !== undefined ? aiResult[key] : currentCVData[key];
    });
    finalData = filteredResult;
  }

  // 4. Update Analysis and all associated templates
  await db.update(cvAnalyses)
    .set({ optimizedData: finalData })
    .where(eq(cvAnalyses.id, analysisId));

  const existingTemplates = await db.query.cvTemplates.findMany({
    where: eq(cvTemplates.analysisId, analysisId)
  });

  if (existingTemplates.length > 0) {
    await db.update(cvTemplates)
      .set({ templateData: finalData, isPaid: true })
      .where(eq(cvTemplates.analysisId, analysisId));
  } else {
    const styles = ['Galaxy', 'Eclipse', 'Aether', 'Hyperion', 'Lunar', 'Stellar', 'Solar', 'Nebula', 'Cosmos', 'Astra', 'Horizon', 'Europass'];
    const templatePromises = styles.map((style, i) => {
      return db.insert(cvTemplates).values({
        analysisId: analysis.id,
        templateNumber: i + 1,
        templateStyle: style,
        templateData: finalData as any,
        isPaid: true
      });
    });
    await Promise.all(templatePromises);
  }

  revalidatePath('/[locale]/results/[id]', 'page');
  revalidatePath('/[locale]/templates/[id]', 'page');

  return { success: true };
}

/**
 * RULE: Credit Deduction Logic
 * Trigger: User clicks Télécharger (First time) or Éditer (New analysis).
 * Action: Deduct 1 credit and mark as paid (unlocks watermark/download).
 */
export async function deductCreditForAnalysis(analysisId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!dbUser) {
    throw new Error("Utilisateur introuvable.");
  }

  if (isCreditsExpired(dbUser)) throw new Error("EXPIRED: Votre plan a expiré.");
  if (getEffectiveCredits(dbUser) < 1) throw new Error("Crédits insuffisants.");

  const analysis = await db.query.cvAnalyses.findFirst({
    where: eq(cvAnalyses.id, analysisId)
  });

  if (!analysis) throw new Error("Analyse introuvable.");

  // Rule: Check if already paid (no double deduction for same analysis)
  const existingPaidTemplate = await db.query.cvTemplates.findFirst({
    where: and(eq(cvTemplates.analysisId, analysisId), eq(cvTemplates.isPaid, true))
  });

  if (existingPaidTemplate) return { success: true, alreadyPaid: true };

  // 1. Deduct 1 Credit
  await db.update(users)
    .set({ credits: sql`${users.credits} - 1` })
    .where(eq(users.id, dbUser.id));

  // 2. Ensure templates exist and mark as paid (unlocks watermark)
  const existingTemplates = await db.query.cvTemplates.findMany({
    where: eq(cvTemplates.analysisId, analysisId)
  });

  if (existingTemplates.length === 0) {
    const styles = ['Galaxy', 'Eclipse', 'Aether', 'Hyperion', 'Lunar', 'Stellar', 'Solar', 'Nebula', 'Cosmos', 'Astra', 'Horizon', 'Europass'];
    const templatePromises = styles.map((style, i) => db.insert(cvTemplates).values({
      analysisId: analysisId,
      templateNumber: i + 1,
      templateStyle: style,
      templateData: analysis.optimizedData as any,
      isPaid: true
    }));
    await Promise.all(templatePromises);
  } else {
    await db.update(cvTemplates)
      .set({ isPaid: true })
      .where(eq(cvTemplates.analysisId, analysisId));
  }

  revalidatePath('/[locale]/templates/[id]', 'page');
  return { success: true };
}
