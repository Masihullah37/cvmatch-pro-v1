import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUserWithClerk() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  });

  const email = clerkUser.emailAddresses[0]?.emailAddress || "";
  const name = clerkUser.firstName 
    ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() 
    : email;

  if (!dbUser) {
    // New user
    const [newUser] = await db.insert(users).values({
      clerkId: clerkUser.id,
      email,
      name,
      plan: 'free',
      credits: 0,
    }).returning();
    return newUser;
  } else if (!dbUser.email || !dbUser.name) {
    // Update missing details
    const [updatedUser] = await db.update(users).set({
      email,
      name,
      updatedAt: new Date(),
    }).where(eq(users.clerkId, clerkUser.id)).returning();
    return updatedUser;
  }

  return dbUser;
}
