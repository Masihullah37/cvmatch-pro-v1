import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// General API protection — 100 requests per minute
export const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "cvboost_general",
});

// ATS scan — guest: 5/hour per IP, paid: 20/hour per user
export const strictRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "cvboost_strict",
});

// Paid user limit — more generous
export const paidUserRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 h"),
  analytics: true,
  prefix: "cvboost_paid",
});

// PDF download limit — prevents PDF generation abuse
export const pdfRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
  prefix: "cvboost_pdf",
});

// Daily hard limit — blocks sustained attacks
export const dailyRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "24 h"),
  analytics: true,
  prefix: "cvboost_daily",
});
