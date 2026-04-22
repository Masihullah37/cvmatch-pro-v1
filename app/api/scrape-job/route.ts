import { NextResponse } from 'next/server';
import { scrapeJobUrl } from '@/lib/scraper/job-scraper';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit/upstash';

const schema = z.object({
  url: z.string().url(),
});

export async function POST(req: Request) {
  try {
    // Rate limit check
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const { success, reset } = await rateLimit.limit(`scrape_job_${ip}`);
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { 
        status: 429,
        headers: {
          'Retry-After': reset.toString(),
        }
      });
    }

    const body = await req.json();
    const { url } = schema.parse(body);

    const description = await scrapeJobUrl(url);

    return NextResponse.json({ description });
  } catch (error: any) {
    console.error('API /scrape-job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
