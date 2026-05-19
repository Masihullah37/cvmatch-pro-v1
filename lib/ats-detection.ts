import { ATSPlatform, ATSEvaluationResult } from "@/types/ats";

export const atsPlatforms: ATSPlatform[] = [
  // French Market Leaders & Job Boards
  {
    id: "hellowork",
    name: "HelloWork",
    targetFormat: "PDF",
    domains: ["hellowork.com", "candidats.hellowork.com"],
    keywords: ["hellowork", "candidats.hellowork"],
    description: "Plateforme leader de l'emploi en France, utilisant un parseur PDF natif pour l'extraction de CV."
  },
  {
    id: "welcometothejungle",
    name: "Welcome to the Jungle ATS",
    targetFormat: "PDF",
    domains: ["welcometothejungle.com", "welcomekit.co"],
    keywords: ["welcome to the jungle", "welcomekit", "wttj"],
    description: "Système de suivi WelcomeKit optimisé pour le rendu visuel et textuel des fichiers PDF."
  },
  {
    id: "apec",
    name: "APEC",
    targetFormat: "PDF",
    domains: ["apec.fr", "cadres.apec.fr"],
    keywords: ["apec", "cadres.apec"],
    description: "Portail de l'emploi des cadres en France, préférant le format vectoriel PDF pour sa recherche sémantique."
  },
  {
    id: "meteojob",
    name: "Meteojob",
    targetFormat: "PDF",
    domains: ["meteojob.com"],
    keywords: ["meteojob"],
    description: "Job board français exploitant un algorithme de matching prédictif sémantique sur fichiers PDF."
  },
  {
    id: "flatchr",
    name: "Flatchr",
    targetFormat: "PDF",
    domains: ["flatchr.io"],
    keywords: ["flatchr"],
    description: "Logiciel de recrutement (ATS) français nécessitant le format PDF pour une indexation structurée."
  },
  {
    id: "beetween",
    name: "Beetween",
    targetFormat: "PDF",
    domains: ["beetween.com", "beetween.fr"],
    keywords: ["beetween"],
    description: "ATS collaboratif français avec moteur de tri automatique calibré pour les structures PDF."
  },

  // Global Platforms & Enterprise Networks
  {
    id: "indeed",
    name: "Indeed ATS",
    targetFormat: "PDF",
    domains: ["indeed.com", "indeedflex.com", "indeed.fr"],
    keywords: ["indeed"],
    description: "Moteur de recherche d'emploi mondial dont le parseur extrait de façon optimale les champs structurés du PDF."
  },
  {
    id: "linkedin",
    name: "LinkedIn EasyApply ATS",
    targetFormat: "PDF",
    domains: ["linkedin.com"],
    keywords: ["linkedin easy apply", "easyapply", "linkedin"],
    description: "Module de candidature simplifiée LinkedIn optimisé pour le parsing automatique de CV au format PDF."
  },
  {
    id: "workday",
    name: "Workday",
    targetFormat: "PDF",
    domains: ["workday.com", "myworkdayjobs.com"],
    keywords: ["workday", "myworkdayjobs"],
    description: "Système ERP d'entreprise mondial reconnu pour son parsing rigide, favorisant le format PDF vectoriel."
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    targetFormat: "PDF",
    domains: ["greenhouse.io", "boards.greenhouse.io"],
    keywords: ["greenhouse"],
    description: "ATS plébiscité par les scale-ups internationales, exploitant des filtres de pertinence basés sur les structures PDF."
  },
  {
    id: "lever",
    name: "Lever",
    targetFormat: "PDF",
    domains: ["lever.co", "jobs.lever.co"],
    keywords: ["lever.co", "jobs.lever"],
    description: "Solution moderne de recrutement globale, optimisant l'extraction de profils sémantiques depuis le format PDF."
  },
  {
    id: "taleo",
    name: "Taleo",
    targetFormat: "PDF",
    domains: ["taleo.net", "oraclecloud.com"],
    keywords: ["taleo", "oracle recruiting"],
    description: "Plateforme historique d'Oracle pour les grandes entreprises, avec un parseur stricte favorisant le format PDF."
  },
  {
    id: "icims",
    name: "iCIMS",
    targetFormat: "PDF",
    domains: ["icims.com", "jobs.icims.com"],
    keywords: ["icims"],
    description: "Logiciel de recrutement cloud d'entreprise, nécessitant des CV en format PDF pour indexer correctement les mots-clés."
  },
  {
    id: "bamboohr",
    name: "BambooHR",
    targetFormat: "PDF",
    domains: ["bamboohr.com", "bamboohr.co"],
    keywords: ["bamboohr"],
    description: "Système RH intégré pour PME, configuré pour lire de manière optimale les CV au format PDF."
  },
  {
    id: "jazzhr",
    name: "JazzHR",
    targetFormat: "PDF",
    domains: ["jazz.co", "jazzhr.com"],
    keywords: ["jazzhr", "resumator"],
    description: "ATS pour entreprises en croissance, tirant parti d'algorithmes d'analyse basés sur le format PDF."
  },
  {
    id: "jobvite",
    name: "Jobvite",
    targetFormat: "PDF",
    domains: ["jobvite.com", "recruiting.ultipro.com"],
    keywords: ["jobvite"],
    description: "Suite de recrutement d'entreprise avec parseur sémantique avancé, configurée de préférence pour le PDF."
  },
  {
    id: "recruitee",
    name: "Recruitee",
    targetFormat: "PDF",
    domains: ["recruitee.com"],
    keywords: ["recruitee"],
    description: "ATS collaboratif européen dont l'analyseur sémantique traite idéalement les documents PDF."
  },

  // Additional Required Platforms to complete 28 systems
  {
    id: "smartrecruiters",
    name: "SmartRecruiters",
    targetFormat: "PDF",
    domains: ["smartrecruiters.com"],
    keywords: ["smartrecruiters"],
    description: "Solution d'acquisition de talents d'entreprise avec indexation sémantique complète pour PDF."
  },
  {
    id: "teamtailor",
    name: "Teamtailor",
    targetFormat: "PDF",
    domains: ["teamtailor.com"],
    keywords: ["teamtailor"],
    description: "ATS moderne suédois axé sur la marque employeur, traitant préférentiellement les CV au format PDF."
  },
  {
    id: "breezyhr",
    name: "Breezy HR",
    targetFormat: "PDF",
    domains: ["breezy.hr"],
    keywords: ["breezy hr", "breezy.hr"],
    description: "Outil de recrutement visuel et collaboratif, extrait au mieux les données structurées du PDF."
  },
  {
    id: "workable",
    name: "Workable",
    targetFormat: "PDF",
    domains: ["workable.com", "jobs.workable.com"],
    keywords: ["workable"],
    description: "Système tout-en-un de recrutement mondial, doté d'un parseur sémantique optimisé pour le PDF."
  },
  {
    id: "taleez",
    name: "Taleez",
    targetFormat: "PDF",
    domains: ["taleez.com"],
    keywords: ["taleez"],
    description: "ATS français conçu pour les PME et startups, indexant de préférence les documents PDF."
  },
  {
    id: "jobaffinity",
    name: "Jobaffinity",
    targetFormat: "PDF",
    domains: ["jobaffinity.fr"],
    keywords: ["jobaffinity"],
    description: "Logiciel de recrutement français conçu pour les cabinets et PME, maximisant la lecture des fichiers PDF."
  },
  {
    id: "talentsoft",
    name: "Cegid Talentsoft",
    targetFormat: "PDF",
    domains: ["talentsoft.com", "cegid.com"],
    keywords: ["talentsoft", "cegid"],
    description: "Leader européen du talent management, préconisant le format PDF pour un parsing sans perte."
  },
  {
    id: "zoho_recruit",
    name: "Zoho Recruit",
    targetFormat: "PDF",
    domains: ["zoho.com", "zoho.eu"],
    keywords: ["zoho recruit", "zoho.com/recruit"],
    description: "ATS multilingue mondial qui segmente idéalement les sections de CV fournis en PDF."
  },
  {
    id: "ashby",
    name: "Ashby",
    targetFormat: "PDF",
    domains: ["ashbyhq.com"],
    keywords: ["ashbyhq", "ashby"],
    description: "ATS axé sur la donnée et la vitesse de recrutement, indexant précisément les structures de CV au format PDF."
  },
  {
    id: "successfactors",
    name: "SAP SuccessFactors",
    targetFormat: "PDF",
    domains: ["successfactors.com", "sap.com"],
    keywords: ["successfactors", "sap recruiting"],
    description: "Suite logicielle RH SAP de niveau entreprise mondiale, dotée d'un parseur sémantique structuré orienté PDF."
  },
  {
    id: "bullhorn",
    name: "Bullhorn",
    targetFormat: "PDF",
    domains: ["bullhorn.com"],
    keywords: ["bullhorn"],
    description: "Logiciel leader de recrutement et d'intérim, optimisé pour l'indexation de mots-clés de CV PDF."
  }
];

/**
 * Detects the target ATS platform based on job URL, job description, or CV content.
 */
export function detectATSPlatform(
  jobUrl?: string,
  jobDescription?: string,
  cvText?: string
): ATSPlatform | null {
  const combinedText = `${jobDescription || ""} ${cvText || ""}`.toLowerCase();

  // 1. Try URL domain matching (highest confidence)
  if (jobUrl) {
    try {
      const hostname = new URL(jobUrl).hostname.toLowerCase();
      for (const platform of atsPlatforms) {
        if (platform.domains.some(domain => hostname.includes(domain))) {
          return platform;
        }
      }
    } catch (_) {
      // Ignored invalid URL
    }
  }

  // 2. Try Keyword matching in combined job description and CV
  for (const platform of atsPlatforms) {
    if (platform.keywords.some(kw => combinedText.includes(kw.toLowerCase()))) {
      return platform;
    }
  }

  return null;
}

/**
 * Evaluates CV compatibility against the detected platform's constraints.
 */
export function evaluateCVCompatibility(
  platform: ATSPlatform | null,
  cvUrlOrName?: string
): ATSEvaluationResult {
  if (!platform) {
    return {
      detectedPlatform: null,
      targetFormat: null,
      isCompatible: true,
      flaws: [],
      suggestions: []
    };
  }

  const flaws: string[] = [];
  const suggestions: string[] = [];
  let isCompatible = true;

  // Determine CV format based on extension
  let cvFormat: "PDF" | "DOCX" | "Unknown" = "Unknown";
  if (cvUrlOrName) {
    const lower = cvUrlOrName.toLowerCase();
    if (lower.endsWith(".pdf") || lower.includes(".pdf?")) {
      cvFormat = "PDF";
    } else if (
      lower.endsWith(".docx") ||
      lower.endsWith(".doc") ||
      lower.includes(".docx?") ||
      lower.includes(".doc?")
    ) {
      cvFormat = "DOCX";
    }
  }

  // Validate format against ATS target format
  if (platform.targetFormat !== "Any" && cvFormat !== "Unknown") {
    if (cvFormat !== platform.targetFormat) {
      isCompatible = false;
      flaws.push(
        `Le format du CV actuel (${cvFormat}) n'est pas optimal pour la plateforme de recrutement détectée (${platform.name}), qui privilégie le format ${platform.targetFormat}.`
      );
      suggestions.push(
        `Enregistrez et importez votre CV au format ${platform.targetFormat} pour assurer une lecture sans erreur par le système d'analyse de ${platform.name}.`
      );
    }
  }

  return {
    detectedPlatform: platform.name,
    targetFormat: platform.targetFormat,
    isCompatible,
    flaws,
    suggestions
  };
}
