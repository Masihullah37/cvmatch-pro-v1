import * as cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function scrapeJobUrl(url: string): Promise<string> {
  try {
    // Check cache
    const cached = await redis.get<string>(`job_scrape:${url}`);
    if (cached) {
      return cached;
    }

    let html = '';
    
    // We try to use Axios + Cheerio first for speed
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 8000,
      });
      html = response.data;
    } catch (e) {
      console.warn("Axios failed, falling back to Puppeteer", e);
      // Fallback to Puppeteer for SPAs or pages blocking basic HTTP clients
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      html = await page.content();
      await browser.close();
    }

    const $ = cheerio.load(html);
    
    // Remove unwanted elements
    $('script, style, noscript, nav, header, footer, iframe, img, svg').remove();
    
    // Extract main text
    // A simplistic approach that targets main or article elements first
    let mainContent = $('main').text() || $('article').text() || $('.job-description').text();
    
    if (!mainContent.trim()) {
      mainContent = $('body').text();
    }
    
    // Clean up whitespace
    const cleanText = mainContent.replace(/\s+/g, ' ').trim();
    
    // Cache for 24 hours
    await redis.setex(`job_scrape:${url}`, 60 * 60 * 24, cleanText);

    return cleanText;
  } catch (error) {
    console.error("Error scraping job URL:", error);
    throw new Error('Failed to scrape job URL. Please paste the description manually.');
  }
}
