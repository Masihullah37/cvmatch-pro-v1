import { cookies } from "next/headers";
import crypto from "crypto";

const TRACKING_COOKIE_NAME = "_cvb_track";
const SALT = process.env.TRACKING_SALT || "default_salt";

export async function getTrackingToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TRACKING_COOKIE_NAME)?.value;
  return token || "anon_fallback";
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token + SALT).digest("hex");
}

export async function getHashedTrackingToken(): Promise<string> {
  const token = await getTrackingToken();
  return hashToken(token);
}
