type CreditAwareUser = {
  credits: number | null;
  creditsExpiry: Date | string | null;
  plan: "free" | "one_time" | "monthly" | null;
  subscriptionStatus: "active" | "canceled" | "past_due" | null;
};

export function isCreditsExpired(user: CreditAwareUser): boolean {
  if (!user.creditsExpiry) {
    return false;
  }

  const expiry = new Date(user.creditsExpiry);
  return Number.isFinite(expiry.getTime()) && new Date() > expiry;
}

export function getEffectiveCredits(user: CreditAwareUser): number {
  if (isCreditsExpired(user)) {
    return 0;
  }
  return Math.max(0, user.credits || 0);
}

export function isUserExpired(user: CreditAwareUser): boolean {
  return isCreditsExpired(user);
}

export function isActivePaidUser(user: CreditAwareUser): boolean {
  return getEffectiveCredits(user) > 0 && !isCreditsExpired(user);
}
