import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 100 requests per 1 minute
export const rateLimit = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  }),
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
});

// Stricter limiter for heavy operations
export const strictRateLimit = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  }),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
});
