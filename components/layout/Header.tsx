// 


'use client';

import { Link } from '@/i18n/routing';
import AuthButtons from './AuthButtons';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, ChevronLeft as BackIcon, ChevronRight as ForwardIcon, Plus } from 'lucide-react';

export default function Header() {
  const { userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/' || pathname === '/fr' || pathname === '/en';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    
    if (userId) {
      fetch('/api/user/role')
        .then(res => res.json())
        .then(data => setIsAdmin(data.isAdmin))
        .catch(() => {});
    }

    return () => window.removeEventListener('scroll', onScroll);
  }, [userId]);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100'
        : 'bg-transparent'
    }`}>
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">

        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-all" />
              <Image
                src="/ouicvlogo.png"
                alt="OuiCV Logo"
                width={120}
                height={40}
                className="relative object-contain group-hover:scale-105 transition-transform"
                style={{ height: "auto" }}
              />
            </div>
          </Link>


        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#analyze" className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Plus size={14} /> Nouvelle Analyse
          </Link>
          <Link href="/#pricing" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
            Tarifs
          </Link>
          {userId && (
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                Dashboard
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm font-black text-white bg-emerald-600 px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                  Admin
                </Link>
              )}
            </div>
          )}
        </nav>

        {/* Right */}
        <div className="hidden md:flex items-center gap-4">
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
          <Link href="/#analyze" className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all" onClick={() => setMobileOpen(false)}>
            <Plus size={14} /> Nouvelle Analyse
          </Link>
          <Link href="/#pricing" className="block text-sm font-bold text-emerald-600 py-2" onClick={() => setMobileOpen(false)}>
            Tarifs
          </Link>
          {userId && (
            <>
              <Link href="/dashboard" className="block text-sm font-bold text-emerald-600 py-2" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
              {isAdmin && (
                <Link href="/admin" className="block text-sm font-bold text-emerald-600 py-2" onClick={() => setMobileOpen(false)}>
                  Admin Panel
                </Link>
              )}
            </>
          )}
          <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
            <AuthButtons />
          </div>
        </div>
      )}
    </header>
  );
}