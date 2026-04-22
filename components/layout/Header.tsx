import { Link } from '@/i18n/routing';
import AuthButtons from './AuthButtons';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { auth } from '@clerk/nextjs/server';

export default async function Header() {
  const { userId } = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e5e0d4] bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            CVMatch Pro
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
             <Link href="/dashboard" className="text-sm font-semibold text-primary border-b-2 border-primary pb-1">
               Tableau de bord
             </Link>
             <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pb-1">
               Emplois
             </Link>
             <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pb-1">
               Analyses
             </Link>
          </nav>
        </div>

        {/* Right Side: Auth & Lang */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          <div className="flex items-center gap-4">
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  );
}
