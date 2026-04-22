"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: 'fr' | 'en') => {
    startTransition(() => {
      router.replace({ pathname }, { locale: newLocale });
    });
  };

  return (
    <div className="flex gap-2 text-sm font-medium">
      <button
        onClick={() => switchLocale('fr')}
        disabled={isPending}
        className={`px-2 py-1 rounded transition-colors ${locale === 'fr' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
      >
        FR
      </button>
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={`px-2 py-1 rounded transition-colors ${locale === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
      >
        EN
      </button>
    </div>
  );
}
