import * as cheerio from 'cheerio';

export interface StructuredJobDetails {
  title: string;
  skills: string[];
  requirements: string[];
  responsibilities: string[];
  keywords: string[];
}

/**
 * Detects if a string is a valid URL
 */
export function isUrl(text: string): boolean {
  try {
    const url = new URL(text.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

const SKILL_HINTS = [
  'javascript', 'typescript', 'react', 'next.js', 'node.js', 'node', 'python', 'java',
  'sql', 'postgresql', 'mysql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git',
  'figma', 'excel', 'power bi', 'tableau', 'agile', 'scrum', 'api', 'rest', 'graphql',
  'communication', 'leadership', 'problem solving'
];

/**
 * Fetches and extracts text content from a job posting URL.
 * Uses the native fetch API (available in Node 18+/Next.js server actions)
 * with a two-phase approach:
 * 1. Fetch + parse HTML with cheerio to extract candidate content
 * 2. Clean the extracted text by stripping non-job-description noise
 */
export async function scrapeJobDescription(url: string): Promise<string> {
  const trimmedUrl = url.trim();
  console.log(`[Scraper] Attempting to scrape: ${trimmedUrl}`);

  let html: string;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(trimmedUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[Scraper] HTTP ${response.status} for ${trimmedUrl}`);
      throw new Error(
        `Le site a renvoyé une erreur HTTP ${response.status}. Le site bloque peut-être les requêtes automatiques.`
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      throw new Error(
        "L'URL ne pointe pas vers une page HTML. Veuillez vérifier le lien."
      );
    }

    html = await response.text();
    console.log(`[Scraper] Received ${html.length} chars of HTML`);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error(`[Scraper] Request timed out for ${trimmedUrl}`);
      throw new Error(
        "La requête a expiré (timeout). Le site est peut-être lent ou inaccessible."
      );
    }
    if (error.message && !error.message.includes('fetch')) {
      throw error;
    }
    console.error(`[Scraper] Fetch error for ${trimmedUrl}:`, error.message);
    throw new Error(
      `Impossible de se connecter à l'URL : ${error.message || 'erreur réseau inconnue'}`
    );
  }

  // ─── Phase 1: Extract structured job content with cheerio ───
  const $ = cheerio.load(html);

  // Extract the page title (often contains the job title)
  const pageTitle = $('title').text().trim();

  // Remove noise elements aggressively
  $(
    'script, style, noscript, nav, footer, header, iframe, img, svg, video, audio, ' +
    '.ads, #ads, .cookie-banner, .cookie-consent, .sidebar, aside, ' +
    '.social-share, .share-buttons, .related-jobs, .similar-jobs, ' +
    '.comments, .comment-section, .newsletter, .signup-form, ' +
    '[class*="cookie"], [class*="banner"], [class*="popup"], [class*="modal"], ' +
    '[class*="share"], [class*="social"], [class*="newsletter"], ' +
    '[class*="footer"], [class*="header"], [class*="nav"], ' +
    '[role="navigation"], [role="banner"], [role="contentinfo"], ' +
    'form:not([class*="apply"])'
  ).remove();

  // Job-board-specific selectors (ordered from most specific to least)
  const jobSpecificSelectors = [
    // Indeed
    '#jobDescriptionText',
    '.jobsearch-JobComponent-description',
    '.jobsearch-jobDescriptionText',
    // LinkedIn
    '.show-more-less-html__markup',
    '.description__text',
    '.jobs-description__content',
    // Glassdoor
    '.jobDescriptionContent',
    '#JobDescriptionContainer',
    // Monster
    '.job-description',
    '#JobDescription',
    // Welcome to the Jungle
    '[data-testid="job-section-description"]',
    '.sc-bXCLTC', // WTTJ dynamic class fallback
    // Pole Emploi / France Travail
    '.description-offre',
    '.content-offre',
    '#TexteOffre',
    // HelloWork
    '.offer-description',
    // Apec
    '.details-post',
    // Generic
    '[data-automation="jobDescription"]',
    '[class*="job-description"]',
    '[class*="jobDescription"]',
    '[class*="job_description"]',
    '[id*="job-description"]',
    '[id*="jobDescription"]',
    '[id*="job_description"]',
    '[itemprop="description"]',
  ];

  // Try job-specific selectors first
  let extractedText = '';
  let matchedSelector = '';

  for (const selector of jobSpecificSelectors) {
    const element = $(selector);
    if (element.length > 0) {
      // Use structured extraction: get text from each paragraph/list item separately
      const parts: string[] = [];
      element.find('p, li, h1, h2, h3, h4, h5, h6, div:not(:has(p, li, div))').each((_, el) => {
        const text = $(el).text().replace(/\s+/g, ' ').trim();
        if (text.length > 5) parts.push(text);
      });

      if (parts.length > 0) {
        extractedText = parts.join('\n');
      } else {
        extractedText = element.text().replace(/\s+/g, ' ').trim();
      }

      if (extractedText.length > 100) {
        matchedSelector = selector;
        console.log(`[Scraper] Matched job selector "${selector}" with ${extractedText.length} chars`);
        break;
      }
    }
  }

  // Semantic fallback: try main/article
  if (extractedText.length < 100) {
    const semanticSelectors = ['main article', 'main', 'article', '.content', '#content'];
    for (const selector of semanticSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        const parts: string[] = [];
        element.find('p, li, h1, h2, h3, h4, h5, h6').each((_, el) => {
          const text = $(el).text().replace(/\s+/g, ' ').trim();
          if (text.length > 5) parts.push(text);
        });
        if (parts.length > 0) {
          extractedText = parts.join('\n');
        } else {
          extractedText = element.text().replace(/\s+/g, ' ').trim();
        }
        if (extractedText.length > 100) {
          matchedSelector = selector;
          console.log(`[Scraper] Matched semantic selector "${selector}" with ${extractedText.length} chars`);
          break;
        }
      }
    }
  }

  // Last resort: body text
  if (extractedText.length < 50) {
    extractedText = $('body').text().replace(/\s+/g, ' ').trim();
    matchedSelector = 'body (fallback)';
    console.log(`[Scraper] Using body fallback with ${extractedText.length} chars`);
  }

  if (extractedText.length < 30) {
    throw new Error(
      "La page ne contient pas assez de texte exploitable. Le contenu est peut-être chargé dynamiquement (JavaScript). Veuillez copier-coller la description manuellement."
    );
  }

  // ─── Phase 2: Clean the extracted text ───
  const cleanedText = cleanJobText(extractedText, pageTitle);
  validateScrapedContentQuality(cleanedText);
  
  // Cap at 5000 chars for the AI prompt
  const result = cleanedText.substring(0, 5000);
  console.log(`[Scraper] Final cleaned text: ${result.length} chars (from ${matchedSelector})`);
  console.log(`[Scraper] Preview: ${result.substring(0, 300)}...`);
  return result;
}

/**
 * Cleans raw scraped text by removing common noise patterns
 * that aren't part of the actual job description.
 */
function cleanJobText(text: string, pageTitle: string): string {
  const lines = text.split('\n');
  
  // Noise patterns to filter out (case-insensitive)
  const noisePatterns = [
    /^(accept|reject|manage)\s*(all\s*)?(cookies|preferences)/i,
    /cookie\s*(policy|notice|consent|preferences)/i,
    /we\s*use\s*cookies/i,
    /nous\s*utilisons\s*des\s*cookies/i,
    /gdpr|rgpd/i,
    /^(sign\s*in|log\s*in|sign\s*up|register|s'inscrire|se\s*connecter|créer\s*un\s*compte)/i,
    /^(share|partager|tweet|linkedin|facebook|twitter|pinterest)\s*$/i,
    /^(apply\s*now|postuler|candidater)\s*$/i,
    /^\d+\s*(views?|vues?|applicants?|candidats?|postulants?)\s*$/i,
    /^(posted|publié|mis\s*à\s*jour)\s*\d/i,
    /^(similar\s*jobs?|emplois?\s*similaires|offres?\s*similaires)/i,
    /^(about\s*us|à\s*propos|qui\s*sommes)/i,
    /^copyright\s*©/i,
    /^(privacy|confidentialité|mentions?\s*légales)/i,
    /^(terms|conditions|cgu|cgv)/i,
    /all\s*rights\s*reserved/i,
    /tous\s*droits\s*réservés/i,
    /^(newsletter|subscribe|abonnez)/i,
    /^(download\s*app|télécharger\s*l'application)/i,
    /^(follow\s*us|suivez)/i,
  ];

  const cleanedLines = lines
    .map(line => line.trim())
    .filter(line => {
      if (line.length < 3) return false;
      // Filter out noise
      for (const pattern of noisePatterns) {
        if (pattern.test(line)) return false;
      }
      return true;
    });

  let result = cleanedLines.join('\n');
  
  // Remove excessive whitespace but preserve paragraph structure
  result = result.replace(/\n{3,}/g, '\n\n');
  result = result.replace(/[ \t]+/g, ' ');
  
  // Prepend the page title as context if it looks like a job title
  if (pageTitle && pageTitle.length > 10 && pageTitle.length < 200) {
    result = `Titre du poste: ${pageTitle}\n\n${result}`;
  }

  return result.trim();
}

function validateScrapedContentQuality(text: string): void {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const meaningfulLines = lines.filter((line) => line.length >= 20);

  if (text.length < 250 || meaningfulLines.length < 5) {
    throw new Error(
      "Impossible d'extraire une description de poste fiable depuis cette URL. Veuillez copier-coller la description du poste manuellement."
    );
  }

  const lower = text.toLowerCase();
  const noiseSignals = [
    'cookie', 'privacy policy', 'politique de confidentialite', 'conditions',
    'mentions legales', 'sign in', 'se connecter'
  ];

  const contentSignals = [
    'responsabil', 'mission', 'requirement', 'qualification', 'profil',
    'skills', 'competence', 'experience', 'expérience'
  ];

  const noiseCount = noiseSignals.reduce((acc, token) => acc + (lower.includes(token) ? 1 : 0), 0);
  const contentCount = contentSignals.reduce((acc, token) => acc + (lower.includes(token) ? 1 : 0), 0);

  if (noiseCount >= 3 && contentCount < 2) {
    throw new Error(
      "Le contenu extrait semble incomplet ou non pertinent. Veuillez copier-coller la description du poste manuellement."
    );
  }
}

function toLineList(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length >= 4);
}

export function extractStructuredJobDetails(jobDescription: string): StructuredJobDetails {
  const lines = toLineList(jobDescription);
  const normalized = jobDescription.toLowerCase();

  const titleMatch = jobDescription.match(/titre du poste:\s*(.+)/i);
  const title = titleMatch?.[1]?.trim() || lines[0] || 'Poste recherché';

  const responsibilities = lines.filter((line) =>
    /(responsabil|mission|vous serez|your role|you will|contribu)/i.test(line)
  ).slice(0, 10);

  const requirements = lines.filter((line) =>
    /(requirement|profil recherché|qualification|must have|expérience|experience|dipl[oô]me|formation)/i.test(line)
  ).slice(0, 12);

  const skillsFromHints = SKILL_HINTS.filter((skill) => normalized.includes(skill));
  const skillsFromLines = lines
    .filter((line) => /(comp[eé]tence|skill|ma[iî]trise|technolog|outil)/i.test(line))
    .flatMap((line) => line.split(/[,:;|/]/))
    .map((part) => part.trim())
    .filter((part) => part.length >= 3 && part.length <= 40)
    .slice(0, 20);

  const uniqueSkills = Array.from(new Set([...skillsFromHints, ...skillsFromLines])).slice(0, 20);
  const keywords = Array.from(
    new Set(
      [...uniqueSkills, ...requirements, ...responsibilities]
        .flatMap((entry) => entry.toLowerCase().split(/[^a-zA-Z0-9+#.]+/))
        .filter((token) => token.length >= 4)
    )
  ).slice(0, 40);

  return {
    title,
    skills: uniqueSkills,
    requirements,
    responsibilities,
    keywords,
  };
}
