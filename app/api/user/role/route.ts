import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ isAdmin: false });

  const [user] = await db.select().from(users).where(eq(users.clerkId, userId));
  return NextResponse.json({ isAdmin: !!user?.isAdmin });
}
