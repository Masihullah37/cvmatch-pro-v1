// 


'use client';

import { Link } from '@/i18n/routing';
import AuthButtons from './AuthButtons';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const { userId } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100'
        : 'bg-transparent'
    }`}>
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/ouicvlogo.png"
            alt="CVBoost Logo"
            width={36}
            height={36}
            className="rounded-xl"
          />
          <span className="font-black text-xl text-slate-900 tracking-tight">
            CV<span className="text-primary">Boost</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#pricing" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
            Tarifs
          </Link>
          {userId && (
            <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <AuthButtons />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-6 space-y-4 shadow-xl">
          <Link href="/#pricing" className="block text-sm font-bold text-slate-700 py-2" onClick={() => setMobileOpen(false)}>
            Tarifs
          </Link>
          {userId && (
            <Link href="/dashboard" className="block text-sm font-bold text-slate-700 py-2" onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
          )}
          <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
            <LanguageSwitcher />
            <AuthButtons />
          </div>
        </div>
      )}
    </header>
  );
}