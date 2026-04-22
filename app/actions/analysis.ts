'use server';

import { db } from "@/lib/db";
import { cvAnalyses, cvTemplates } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { analyzeCV, generateOptimizedCV } from "@/lib/ai/ats-analyzer";
import { parseCVFile } from "@/lib/ai/cv-parser";

export async function performCVAnalysis(formData: FormData) {
  const cvFile = formData.get('cvFile') as File;
  const jobTitle = formData.get('jobTitle') as string;
  const jobDescription = formData.get('jobDescription') as string;

  if (!cvFile || !jobDescription) {
    throw new Error("Missing required data");
  }

  // 1. Parse CV
  // const buffer = Buffer.from(await cvFile.arrayBuffer());
  // const cvText = await parseCVFile(buffer, cvFile.name);

  // 1. Parse CV
  const buffer = Buffer.from(await cvFile.arrayBuffer());
  const cvText = await parseCVFile(buffer, cvFile.name);

  // ADD THESE DEBUG LINES:
  console.log("=== CV TEXT PARSED ===");
  console.log("Length:", cvText.length);
  console.log("First 500 chars:", cvText.substring(0, 500));
  console.log("======================");

  if (!cvText || cvText.trim().length < 50) {
    throw new Error("CV could not be parsed or is empty. Please upload a valid PDF.");
  }

  // 2. Analyze ATS
  const analysisResult = await analyzeCV(cvText, jobDescription);

  // 3. Generate Optimized Content
  const optimizedContent = await generateOptimizedCV(cvText, jobDescription, analysisResult);

  // 4. Create Analysis Record
  // const [newAnalysis] = await db.insert(cvAnalyses).values({
  //   status: 'completed',
  //   atsScore: analysisResult.atsScore,
  //   scoreBreakdown: analysisResult.scoreBreakdown,
  //   flaws: analysisResult.flaws,
  //   suggestions: analysisResult.suggestions,
  //   keywordsFound: analysisResult.keywordsFound,
  //   keywordsMissing: analysisResult.keywordsMissing,
  //   jobTitle: jobTitle || optimizedContent?.jobTitle || "Poste Visé",
  //   jobDescription: jobDescription,
  // }).returning();

  const [newAnalysis] = await db.insert(cvAnalyses).values({
    status: 'completed',
    atsScore: analysisResult.atsScore,
    scoreBreakdown: analysisResult.scoreBreakdown,
    flaws: analysisResult.flaws,
    suggestions: analysisResult.suggestions,
    keywordsFound: analysisResult.keywordsFound,
    keywordsMissing: analysisResult.keywordsMissing,
    userName: optimizedContent?.userName || "Candidat",
    jobTitle: jobTitle || optimizedContent?.jobTitle || "Poste Visé",
    jobDescription: jobDescription,
  }).returning();

  // 5. Create Templates with Optimized Content
  const styles = ['Galaxy', 'Eclipse', 'Aether', 'Hyperion', 'Lunar', 'Stellar', 'Solar', 'Nebula', 'Cosmos', 'Astra', 'Horizon'];
  const templatePromises = styles.map((style, i) => {
    return db.insert(cvTemplates).values({
      analysisId: newAnalysis.id,
      templateNumber: i + 1,
      templateStyle: style,
      templateData: {
        ...(optimizedContent || {}),
        // Fallback for contact if missing from AI (usually AI won't change this much)
        contact: optimizedContent?.contact || {
          email: "contact@exemple.com",
          phone: "+33 6 00 00 00 00",
          location: "Ville, Pays",
        }
      } as any,
      isPaid: false
    });
  });

  await Promise.all(templatePromises);

  revalidatePath('/[locale]/results/[id]', 'page');
  return newAnalysis.id;
}
