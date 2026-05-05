import { db } from '../lib/db';
import { users } from '../lib/db/schema';

async function checkUsers() {
  const allUsers = await db.select().from(users);
  console.log('--- DATABASE USERS ---');
  console.table(allUsers.map(u => ({
    id: u.id,
    clerkId: u.clerkId,
    email: u.email,
    plan: u.plan,
    credits: u.credits
  })));
  process.exit(0);
}

checkUsers().catch(console.error);
