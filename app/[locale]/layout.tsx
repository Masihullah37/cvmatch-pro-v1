export const dynamic = "force-dynamic";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import '../globals.css';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
       <div className="flex min-h-screen">
         <div className="no-print">
           <Sidebar />
         </div>
         <div className="flex-1 flex flex-col min-w-0">
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
    </NextIntlClientProvider>
  );
}
