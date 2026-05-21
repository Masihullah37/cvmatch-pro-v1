'use client';

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function AuthButtons() {
  const { isSignedIn, isLoaded } = useUser();
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  if (!isLoaded) return <div className="w-20 h-8 bg-muted animate-pulse rounded-md" />;

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <SignInButton mode="modal" forceRedirectUrl={currentUrl || undefined} fallbackRedirectUrl={currentUrl || undefined}>
          <button className="text-sm font-black text-slate-600 hover:text-primary transition-colors tracking-tight uppercase">
            Se connecter
          </button>
        </SignInButton>
        <SignInButton mode="modal" forceRedirectUrl={currentUrl || undefined} fallbackRedirectUrl={currentUrl || undefined}>
          <button className="text-sm font-black bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 uppercase tracking-widest text-[10px]">
            S'inscrire
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <UserButton 
      appearance={{
        elements: {
          userButtonPopoverActionButton__security: { display: 'none' },
          userButtonPopoverActionButton__danger: { display: 'none' },
        }
      }}
      userProfileProps={{
        appearance: {
          elements: {
            navbarItem__security: { display: 'none' },
            profileSection__danger: { display: 'none' }
          }
        }
      }}
    />
  );
}


