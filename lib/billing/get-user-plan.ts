import { users } from "@/lib/db/schema";

export type PlanType = "anonymous" | "free" | "trial" | "pro";

interface PlanStatus {
  plan: PlanType;
  credits: number;
  isValid: boolean;
}

export function getUserPlan(user: any): PlanType {
  const status = getUserPlanStatus(user);
  return status.plan;
}

export function getUserPlanStatus(user: any): PlanStatus {
  if (!user) {
    return { plan: "anonymous", credits: 0, isValid: false };
  }

  const now = new Date();

  // Pro Plan
  if (user.plan === "monthly") {
    const isPro = user.subscriptionStatus === "active" || user.subscriptionStatus === "canceled";
    const endsAt = user.subscriptionEndsAt ? new Date(user.subscriptionEndsAt) : null;
    
    if (isPro && endsAt && endsAt > now) {
      return { 
        plan: "pro", 
        credits: user.credits || 0, 
        isValid: true 
      };
    }
    // Fallback to free if expired
    return { plan: "free", credits: 0, isValid: false };
  }

  // Trial Plan (one_time)
  if (user.plan === "one_time") {
    const expiry = user.creditsExpiry ? new Date(user.creditsExpiry) : null;
    if (expiry && expiry > now) {
      return { 
        plan: "trial", 
        credits: user.credits || 0, 
        isValid: true 
      };
    }
    // Fallback to free if expired
    return { plan: "free", credits: 0, isValid: false };
  }

  // Free Plan
  return { 
    plan: "free", 
    credits: user.credits || 0, 
    isValid: true 
  };
}
