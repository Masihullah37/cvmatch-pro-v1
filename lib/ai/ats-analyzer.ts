import Groq from "groq-sdk";
import { type StructuredJobDetails } from "@/lib/utils/scraper";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

if (!process.env.GROQ_API_KEY) {
  console.error("CRITICAL: GROQ_API_KEY is missing from environment variables.");
}

//
// 🔒 SAFE JSON EXTRACTOR (robust)
//
function extractJSON(text: string) {
  const match = text.match(/\{[\s\S]*\}/);

  if (!match) {
    console.error("❌ RAW AI RESPONSE:", text);
    throw new Error("No valid JSON found in response");
  }

  return match[0];
}

//
// 🔒 SAFE PARSER (prevents crashes)
//
function safeParse(text: string) {
  try {
    const jsonString = extractJSON(text);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("❌ JSON PARSE FAILED");
    console.error("RAW RESPONSE:", text);
    throw new Error("Invalid JSON returned by AI");
  }
}

//
// 📊 ANALYZE CV (ATS SCORING)
//
export async function analyzeCV(
  cvText: string,
  jobDescription: string,
  structuredJobDetails?: StructuredJobDetails
) {
  const safeCvText = cvText.substring(0, 6000);
  const safeJobDescription = jobDescription.substring(0, 3000);

  const structuredContext = structuredJobDetails
    ? `
Structured Job Data:
- Title: ${structuredJobDetails.title}
- Skills: ${structuredJobDetails.skills.join(", ") || "N/A"}
- Requirements: ${structuredJobDetails.requirements.join(" | ") || "N/A"}
- Responsibilities: ${structuredJobDetails.responsibilities.join(" | ") || "N/A"}
- Keyword seeds: ${structuredJobDetails.keywords.join(", ") || "N/A"}
`
    : "";

  const prompt = `
Analyze this CV ${jobDescription.includes('Optimisation standard') ? 'for general professional standards' : 'against the Job Description for ATS compatibility'}.

Return ONLY valid JSON. No explanations, no markdown.
Ignore website navigation, cookie banners, legal notices, and any non-job-content noise.

{
  "atsScore": 0,
  "scoreBreakdown": {
    "keywordMatch": { "score": 0, "max": 30 },
    "format": { "score": 0, "max": 20 },
    "experience": { "score": 0, "max": 20 },
    "education": { "score": 0, "max": 10 },
    "skills": { "score": 0, "max": 15 },
    "readability": { "score": 0, "max": 5 }
  },
  "flaws": [],
  "suggestions": [],
  "keywordsMissing": [],
  "keywordsFound": []
}

CV:
${safeCvText}

${jobDescription.includes('Optimisation standard') ? '' : `JD:\n${safeJobDescription}`}
${structuredContext}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 2000,
    });

    const text = completion.choices[0]?.message?.content || "";

    return safeParse(text);
  } catch (error: any) {
    console.error("Groq API Analysis Error:", error?.message || error);
    throw new Error(`Failed to analyze CV: ${error?.message || "Unknown error"}`);
  }
}

//
// ✍️ EXTRACT RAW CV DATA (No optimization)
//
export async function extractRawCVData(cvText: string) {
  const safeCvText = cvText.substring(0, 6000);

  const prompt = `
You are a CV parser. Extract all information from the provided CV into the exact JSON structure below.
DO NOT optimize, DO NOT rephrase, DO NOT improve. Just extract exactly what is written.
Match the original language of the CV.

Return ONLY valid JSON:

{
  "userName": "",
  "jobTitle": "",
  "summary": "",
  "contact": { "email": "", "phone": "", "location": "" },
  "experience": [{ "title": "", "company": "", "period": "", "description": "" }],
  "education": [{ "degree": "", "school": "", "year": "", "details": "" }],
  "projects": [{ "name": "", "description": "", "technologies": [] }],
  "skills": [],
  "languages": [{ "language": "", "level": "" }],
  "interests": []
}

CV:
${safeCvText}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 3000,
    });

    const text = completion.choices[0]?.message?.content || "";
    const parsed = safeParse(text);

    return parsed;
  } catch (error: any) {
    console.error("Groq API Extraction Error:", error?.message || error);
    return null;
  }
}

//
// ✍️ GENERATE OPTIMIZED CV
//
export async function generateOptimizedCV(
  cvText: string,
  jobDescription: string,
  analysisResult?: any,
  structuredJobDetails?: StructuredJobDetails
) {
  const safeCvText = cvText.substring(0, 6000);
  const safeJobDescription = jobDescription.substring(0, 3000);

  const structuredContext = structuredJobDetails
    ? `
Structured Job Data:
- Title: ${structuredJobDetails.title}
- Skills: ${structuredJobDetails.skills.join(", ") || "N/A"}
- Requirements: ${structuredJobDetails.requirements.join(" | ") || "N/A"}
- Responsibilities: ${structuredJobDetails.responsibilities.join(" | ") || "N/A"}
`
    : "";

  const prompt = `
You are an expert professional CV writer.
${jobDescription.includes('Optimisation standard')
      ? "Perform a high-level professional optimization. Focus on impact, clarity, and modern professional standards."
      : "Optimize this CV specifically for the Job Description below."}

STRICT RULES:
- Match CV language (French or English)
- Do NOT invent data
- Extract ALL real info
- Use STAR method
- ${jobDescription.includes('Optimisation standard') ? "Maximize professional appeal." : `Integrate keywords: ${analysisResult?.keywordsMissing?.slice(0, 10).join(", ") || ""}`}

Return ONLY valid JSON:

{
  "userName": "",
  "jobTitle": "",
  "summary": "",
  "contact": { "email": "", "phone": "", "location": "" },
  "experience": [{ "title": "", "company": "", "period": "", "description": "" }],
  "education": [{ "degree": "", "school": "", "year": "", "details": "" }],
  "projects": [{ "name": "", "description": "", "technologies": [] }],
  "skills": [],
  "languages": [{ "language": "", "level": "" }],
  "interests": []
}

CV:
${safeCvText}

${jobDescription.includes('Optimisation standard') ? '' : `JD:\n${safeJobDescription}`}
${structuredContext}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 3000,
    });

    const text = completion.choices[0]?.message?.content || "";

    console.log("=== GROQ RAW RESPONSE ===");
    console.log(text.substring(0, 500) + "...");

    const parsed = safeParse(text);

    // 🔧 fallback name extraction
    if (!parsed.userName || parsed.userName.includes("full name")) {
      const nameMatch = cvText.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/);
      if (nameMatch) parsed.userName = nameMatch[1];
    }

    return parsed;
  } catch (error: any) {
    console.error("Groq API Optimization Error:", error?.message || error);

    return {
      userName: "ERROR",
      jobTitle: "Check logs",
      summary: error?.message || "AI failed",
      contact: { email: "", phone: "", location: "" },
      experience: [],
      education: [],
      projects: [],
      skills: [],
      languages: [],
      interests: [],
    };
  }
}
