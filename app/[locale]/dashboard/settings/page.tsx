import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import AccountSettings from "@/components/settings/AccountSettings";

export default async function SettingsPage() {
    const { userId } = await auth();
    
    const dbUser = userId ? await db.query.users.findFirst({
        where: eq(users.clerkId, userId)
    }) : null;

    const credits = dbUser?.credits || 0;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-12 pb-20">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Paramètres du compte</h1>
                <p className="text-slate-500 font-medium mt-1">Gérez vos informations personnelles et la sécurité de vos données.</p>
            </header>

            <AccountSettings credits={credits} />
        </div>
    );
}
