import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cvAnalyses, cvTemplates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { analysisId } = await req.json();

    const analysis = await db.query.cvAnalyses.findFirst({
      where: eq(cvAnalyses.id, analysisId)
    });

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    // Fast check if templates exist
    const existingTemplates = await db.query.cvTemplates.findMany({
      where: eq(cvTemplates.analysisId, analysisId)
    });

    if (existingTemplates.length > 0) {
      return NextResponse.json({ success: true, count: existingTemplates.length });
    }

    // In a real implementation we would call Gemini to generate 10 unique data structures
    // based on original cv, job desc, and 10 specific styles.
    // For this prototype, we simulate creating 10 records.
    
    const styles = ['Alexandre', 'Audrey', 'Emma', 'Mathieu', 'Celine', 'Premium', 'Startup', 'Executive', 'Corporate', 'International'];

    const newTemplates = styles.map((style, i) => ({
      analysisId,
      templateNumber: i + 1,
      templateStyle: style,
      templateData: { 
        userName: analysis.userName || "Votre Nom",
        jobTitle: analysis.jobTitle || "Poste Visé",
        summary: `Résumé optimisé pour l'ATS en utilisant le style ${style}.`,
        contact: {
          email: "user@email.com",
          phone: "+33 6 00 00 00 00",
          location: "Paris, France"
        },
        experience: [
          { title: "Expérience 1", company: "Entreprise A", period: "2022 - 2024", description: "Description optimisée avec mots-clés." }
        ],
        skills: ["React", "TypeScript", "Next.js", "ATS Optimized"],
        education: [{ degree: "Master", school: "Université", year: "2021" }]
      },
      isPaid: false
    }));

    await db.insert(cvTemplates).values(newTemplates);

    return NextResponse.json({ success: true, count: 10 });
  } catch (error: any) {
    console.error('API /generate-templates error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
