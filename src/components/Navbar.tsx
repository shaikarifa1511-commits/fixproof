'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';
import { RoleSwitcher } from './RoleSwitcher';
import { LanguageSelector } from './LanguageSelector';
import {
  BarChart3,
  CheckCircle,
  FileText,
  MapPin,
  Menu,
  PlusCircle,
  Shield,
  ShieldCheck,
  UserCheck,
  Wrench,
  X,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/reports', label: t.allReports || 'All Reports', icon: FileText },
    { href: '/map', label: t.civicMap || 'Civic Map', icon: MapPin },
    { href: '/report', label: t.reportDefect || 'Report Defect', icon: PlusCircle, highlight: true },
    { href: '/my-reports', label: t.myCases || 'My Cases', icon: UserCheck },
    { href: '/analytics', label: t.analytics || 'Analytics', icon: BarChart3 },
  ];

  if (currentUser.role === 'authority') {
    navLinks.push({ href: '/authority', label: t.authorityQueue || 'Authority Queue', icon: Wrench });
  } else if (currentUser.role === 'moderator') {
    navLinks.push({ href: '/moderator', label: t.moderationHub || 'Moderation Hub', icon: Shield });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  FixProof
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  AI Civic
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5 hidden sm:block">
                {t.tagline || 'Reported. Repaired. Verified.'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    item.highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/30 ml-2'
                      : isActive
                      ? 'bg-slate-100 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right utility cluster: Language, Role Switcher, Mobile Toggle */}
          <div className="flex items-center gap-2.5">
            <LanguageSelector />
            <RoleSwitcher />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 animate-fade-in shadow-xl">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  item.highlight
                    ? 'bg-blue-600 text-white'
                    : isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          {/* Quick Mobile Language Navigation */}
          <div className="pt-3 pb-2 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
            {[
              { code: 'en', label: 'English' },
              { code: 'te', label: 'తెలుగు' },
              { code: 'kn', label: 'ಕನ್ನಡ' },
              { code: 'hi', label: 'हिंदी' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold text-xs transition-all ${
                  language === lang.code
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

