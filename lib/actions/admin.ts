'use server';

import { db } from '@/lib/db';
import { users, cvAnalyses, cvTemplates, payments, cvGenerations, siteSettings } from '@/lib/db/schema';
import { eq, sql, desc, and, not } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const user = await currentUser();
  if (!user) throw new Error('Veuillez vous connecter pour accéder à cette page.');
  
  const [dbUser] = await db.select().from(users).where(eq(users.clerkId, user.id));
  if (!dbUser || !dbUser.isAdmin) throw new Error('Accès refusé : Droits administrateur requis.');
  return dbUser;
}

export async function getAllUsers() {
  await checkAdmin();
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserCredits(userId: string, credits: number, expiryDays?: number) {
  await checkAdmin();
  
  const updateData: any = { credits };
  if (expiryDays !== undefined) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    updateData.creditsExpiry = expiryDate;
  }
  
  await db.update(users).set(updateData).where(eq(users.id, userId));
  revalidatePath('/admin');
}

export async function toggleUserBlock(userId: string, isBlocked: boolean) {
  await checkAdmin();
  await db.update(users).set({ isBlocked }).where(eq(users.id, userId));
  revalidatePath('/admin');
}

export async function deleteUser(userId: string) {
  await checkAdmin();
  await db.delete(users).where(eq(users.id, userId));
  revalidatePath('/admin');
}

export async function getAdminStats() {
  await checkAdmin();
  
  const [atsScans] = await db.select({ count: sql<number>`count(*)` }).from(cvAnalyses);
  const [cvGens] = await db.select({ count: sql<number>`count(*)` }).from(cvGenerations);
  const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users);
  
  // Activity by day (last 7 days)
  const dailyActivity = await db.execute(sql`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as count
    FROM cv_analyses
    WHERE created_at > NOW() - INTERVAL '7 days'
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) ASC
  `);

  return {
    totalScans: Number(atsScans.count),
    totalGens: Number(cvGens.count),
    totalUsers: Number(totalUsers.count),
    dailyActivity: dailyActivity.rows
  };
}
export async function getSiteSettings() {
  try {
    const [settings] = await db.select().from(siteSettings).limit(1);
    return settings || null;
  } catch (error) {
    console.error("Site settings fetch failed - table may not exist yet:", error);
    return null;
  }
}

export async function updateSiteSettings(activeOffer: any) {
  await checkAdmin();
  const [existing] = await db.select().from(siteSettings).limit(1);
  
  if (existing) {
    await db.update(siteSettings).set({ activeOffer, updatedAt: new Date() }).where(eq(siteSettings.id, existing.id));
  } else {
    await db.insert(siteSettings).values({ activeOffer });
  }
  revalidatePath('/admin');
}
