export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Missing Clerk WEBHOOK_SECRET');
  }

  const headerPayload = await headers();

  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('❌ Clerk webhook verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const email = evt.data.email_addresses?.[0]?.email_address || '';
    const name =
      evt.data.first_name
        ? `${evt.data.first_name} ${evt.data.last_name || ''}`.trim()
        : email;

    // Find user by clerkId first
    const existingByClerk = await db.query.users.findFirst({
      where: eq(users.clerkId, id!)
    });

    if (existingByClerk) {
      await db.update(users).set({
        email,
        name,
        updatedAt: new Date(),
      }).where(eq(users.clerkId, id!));
    } else {
      // Check if email already exists (maybe from a different clerkId or manual sync)
      const existingByEmail = await db.query.users.findFirst({
        where: eq(users.email, email)
      });

      if (existingByEmail) {
        // Link the existing email to this new clerkId
        await db.update(users).set({
          clerkId: id!,
          name,
          updatedAt: new Date(),
        }).where(eq(users.email, email));
      } else {
        // New user
        await db.insert(users).values({
          clerkId: id!,
          email,
          name,
          plan: 'free',
        });
      }
    }
  }

  if (eventType === 'user.updated') {
    const email = evt.data.email_addresses?.[0]?.email_address || '';
    const name =
      evt.data.first_name
        ? `${evt.data.first_name} ${evt.data.last_name || ''}`.trim()
        : email;

    await db.update(users)
      .set({
        email,
        name,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, id!));
  }

  if (eventType === 'user.deleted') {
    await db.delete(users).where(eq(users.clerkId, id!));
  }

  return new Response('', { status: 200 });
}
