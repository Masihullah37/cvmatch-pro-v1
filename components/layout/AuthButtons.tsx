'use client';

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';

export default function AuthButtons() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div className="w-20 h-8 bg-muted animate-pulse rounded-md" />;

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <SignInButton mode="modal">
          <button className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity">
            Se connecter
          </button>
        </SignInButton>
        <SignInButton mode="modal">
          <button className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            S'inscrire
          </button>
        </SignInButton>
      </div>
    );
  }

  return <UserButton />;
}
