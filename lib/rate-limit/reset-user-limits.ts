import { redis } from "@/lib/rate-limit/upstash";

/**
 * Clears daily ATS / AI rewrite counters for a user after purchase or renewal
 * so a fresh plan starts with a full daily quota (not a stale pre-payment count).
 */
export async function resetAnalysisRateLimitsForUser(
  clerkUserId: string
): Promise<void> {
  if (!clerkUserId || clerkUserId === "guest") return;

  const keys = [
    `ats_daily_paid_${clerkUserId}`,
    `ats_daily_free_${clerkUserId}`,
    `ai_rewrite_pro_${clerkUserId}`,
    `ai_rewrite_trial_${clerkUserId}`,
  ];

  await Promise.all(keys.map((key) => redis.del(key)));
}
