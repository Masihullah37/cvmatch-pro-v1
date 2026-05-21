// export const dynamic = "force-dynamic";
// import { NextIntlClientProvider } from 'next-intl';
// import { getMessages } from 'next-intl/server';
// import { notFound } from 'next/navigation';
// import { Inter } from 'next/font/google';
// import { routing } from '@/i18n/routing';
// import '../globals.css';
// import Header from '@/components/layout/Header';
// import Sidebar from '@/components/layout/Sidebar';
// import Footer from '@/components/layout/Footer';

// const inter = Inter({ subsets: ['latin'] });

// export default async function LocaleLayout({
//   children,
//   params
// }: {
//   children: React.ReactNode;
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;
//   // Ensure that the incoming `locale` is valid
//   if (!routing.locales.includes(locale as any)) {
//     notFound();
//   }

//   // Providing all messages to the client side
//   const messages = await getMessages();

//   return (
//     <NextIntlClientProvider messages={messages} locale={locale}>
//        <div className="flex min-h-screen">
//          <div className="no-print">
//            <Sidebar />
//          </div>
//          <div className="flex-1 flex flex-col min-w-0">
//            <div className="no-print">
//              <Header />
//            </div>
//            <main className="flex-1">
//              {children}
//            </main>
//            <div className="no-print">
//              <Footer />
//            </div>
//          </div>
//        </div>
//     </NextIntlClientProvider>
//   );
// }

// //2nd version//
// export const dynamic = "force-dynamic";
// import { NextIntlClientProvider } from 'next-intl';
// import { getMessages } from 'next-intl/server';
// import { notFound } from 'next/navigation';
// import { Inter } from 'next/font/google';
// import { routing } from '@/i18n/routing';
// import '../globals.css';
// import Header from '@/components/layout/Header';
// import Sidebar from '@/components/layout/Sidebar';
// import Footer from '@/components/layout/Footer';
// import { ClerkProvider } from '@clerk/nextjs';

// const inter = Inter({ subsets: ['latin'] });

// export default async function LocaleLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;

//   if (!routing.locales.includes(locale as any)) {
//     notFound();
//   }

//   const messages = await getMessages();

//   return (
//     <NextIntlClientProvider messages={messages} locale={locale}>
//       <div className="flex min-h-screen bg-slate-50">
//         <div className="no-print">
//           <Sidebar />
//         </div>
//         <div className="flex-1 flex flex-col min-w-0">
//           <div className="no-print">
//             <Header />
//           </div>
//           <main className="flex-1">
//             {children}
//           </main>
//           <div className="no-print">
//             <Footer />
//           </div>
//         </div>
//       </div>
//     </NextIntlClientProvider>
//   );
// }


export const dynamic = "force-dynamic";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Quicksand } from 'next/font/google';
import { routing } from '@/i18n/routing';
import '../globals.css';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/common/CookieConsent';
import { Toaster } from 'sonner';

const font = Quicksand({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

import PromotionModal from '@/components/common/PromotionModal';
import { getSiteSettings } from '@/lib/actions/admin';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  const messages = await getMessages();
  
  const settings = await getSiteSettings() as any;
  const activeOffer = settings?.activeOffer?.isActive ? settings.activeOffer : null;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className={`${font.className} min-h-screen bg-white`}>
        <div className="no-print">
          <Sidebar />
        </div>
        <div
          id="main-content"
          className="sidebar-offset flex flex-col min-h-screen transition-all duration-300"
        >
          <div className="no-print">
            <Header />
          </div>
          <main className="flex-1">
            {children}
          </main>
          <div className="no-print">
            <Footer />
          </div>
        </div>
      </div>
      <CookieConsent />
      <PromotionModal offer={activeOffer} />
      <Toaster richColors position="top-right" />
    </NextIntlClientProvider>
  );
}