import { scrapeJobDescription } from '@/lib/utils/scraper';

export async function scrapeJobUrl(url: string): Promise<string> {
  return scrapeJobDescription(url);
}
