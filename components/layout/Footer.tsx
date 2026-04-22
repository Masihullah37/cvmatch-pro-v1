import { Link } from '@/i18n/routing';

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0 bg-muted/20">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} CVMatch Pro. Tous droits réservés.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link href="#" className="hover:underline">Conditions d'utilisation</Link>
          <Link href="#" className="hover:underline">Politique de confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}
