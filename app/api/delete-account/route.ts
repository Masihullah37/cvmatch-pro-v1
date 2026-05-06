import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const client = await clerkClient();
    
    // 1. Delete from Clerk (this will trigger the user.deleted webhook)
    await client.users.deleteUser(userId);

    // 2. Manual cleanup in case webhook fails or is delayed (optional but safer for immediate UX)
    // The webhook in app/api/webhooks/clerk/route.ts will also handle this.
    // But we can do it here too.
    await db.delete(users).where(eq(users.clerkId, userId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE_ACCOUNT_API] Error:", error.message);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
