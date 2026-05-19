export interface ATSPlatform {
  id: string;
  name: string;
  targetFormat: 'PDF' | 'DOCX' | 'Any';
  domains: string[]; // Hostnames associated with the ATS (e.g. hellowork.com, welcometothejungle.com)
  keywords: string[]; // Keywords in description or CV that identify this platform
  description: string;
}

export interface ATSEvaluationResult {
  detectedPlatform: string | null;
  targetFormat: string | null;
  isCompatible: boolean;
  flaws: string[];
  suggestions: string[];
}
