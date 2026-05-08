'use server';

import { db } from "@/lib/db";
import { cvAnalyses, cvTemplates } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { analyzeCV, generateOptimizedCV } from "@/lib/ai/ats-analyzer";
import { parseCVFile } from "@/lib/ai/cv-parser";
import { extractStructuredJobDetails, isUrl, scrapeJobDescription } from "@/lib/utils/scraper";

import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { users } from "@/lib/db/schema";
import { getEffectiveCredits } from "@/lib/utils/subscription";

export async function performCVAnalysis(formData: FormData) {
  // const { userId } = await auth();
  // if (!userId) {
  //   throw new Error("Unauthorized. Please sign in.");
  // }

  // // 1. Resolve/Sync User
  // let dbUser = await db.query.users.findFirst({
  //   where: eq(users.clerkId, userId)
  // });

  // if (!dbUser) {
  //   // If user record doesn't exist for some reason, create it
  //   const [newUser] = await db.insert(users).values({
  //     clerkId: userId,
  //     credits: 0, 
  //   }).returning();
  //   dbUser = newUser;
  // }


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

  // 2. Analyze ATS
  const analysisResult = await analyzeCV(cvText, jobDescription, structuredJobDetails);

  // 3. Generate Optimized Content
  // This will transform either the CV text OR the profile description into a professional CV format
  const optimizedContent = await generateOptimizedCV(
    cvText,
    jobDescription,
    analysisResult,
    structuredJobDetails
  );

  // 4. Create Analysis Record
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
      userName: optimizedContent?.userName || "Candidat",
      jobTitle: jobTitle || optimizedContent?.jobTitle || "Poste Visé",
      jobDescription: jobDescription,
      optimizedData: optimizedContent, // Save as master JSON
    }).returning();
    newAnalysis = result[0];
  } catch (dbError: any) {
    console.error("=== DB INSERT ERROR ===");
    throw new Error(`Database insert failed: ${dbError?.message ?? 'Unknown DB error'}`);
  }

  revalidatePath('/[locale]/results/[id]', 'page');
  return newAnalysis.id;
}

export async function unlockOptimizedCV(analysisId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId)
  });

  if (!dbUser || getEffectiveCredits(dbUser) < 1) {
    throw new Error("Crédits insuffisants.");
  }

  const analysis = await db.query.cvAnalyses.findFirst({
    where: eq(cvAnalyses.id, analysisId)
  });

  if (!analysis || !analysis.optimizedData) {
    throw new Error("Analyse introuvable.");
  }

  // 1. Deduct 1 Credit
  await db.update(users)
    .set({ credits: sql`${users.credits} - 1` })
    .where(eq(users.id, dbUser.id));

  // 2. Generate Templates
  const optimizedContent = analysis.optimizedData as any;
  const styles = ['Galaxy', 'Eclipse', 'Aether', 'Hyperion', 'Lunar', 'Stellar', 'Solar', 'Nebula', 'Cosmos', 'Astra', 'Horizon', 'Europass'];

  const templatePromises = styles.map((style, i) => {
    return db.insert(cvTemplates).values({
      analysisId: analysis.id,
      templateNumber: i + 1,
      templateStyle: style,
      templateData: {
        ...(optimizedContent || {}),
        contact: optimizedContent?.contact || {
          email: "contact@exemple.com",
          phone: "+33 6 00 00 00 00",
          location: "Ville, Pays",
        }
      } as any,
      isPaid: true // Mark as paid since we just deducted a credit
    });
  });

  await Promise.all(templatePromises);

  revalidatePath('/[locale]/results/[id]', 'page');
  revalidatePath('/[locale]/templates/[id]', 'page');

  return { success: true };
}
