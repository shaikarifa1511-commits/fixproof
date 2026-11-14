'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';
import { SupportedLanguage } from '@/lib/i18n/translations';
import { RoleSwitcher } from './RoleSwitcher';
import { LanguageSelector } from './LanguageSelector';
import { Footer } from './Footer';
import {
  BarChart3,
  Building2,
  Check,
  CheckCircle,
  FileText,
  Flame,
  Globe,
  Home,
  MapPin,
  Menu,
  PhoneCall,
  PlusCircle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  Wrench,
  X,
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages: { code: SupportedLanguage; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'English' },
    { code: 'te', label: 'తెలుగు', sub: 'Telugu' },
    { code: 'kn', label: 'ಕನ್ನಡ', sub: 'Kannada' },
    { code: 'hi', label: 'हिंदी', sub: 'Hindi' },
  ];

  const mainNavItems = [
    {
      href: '/',
      label: t.homeNav || 'Home',
      icon: Home,
      exact: true,
    },
    {
      href: '/reports',
      label: t.allReports || 'All Reports',
      icon: FileText,
    },
    {
      href: '/map',
      label: t.civicMap || 'Civic Map',
      icon: MapPin,
    },
    {
      href: '/my-reports',
      label: t.myCases || 'My Cases',
      icon: UserCheck,
    },
  ];

  const publicServiceNavItems = [
    {
      href: '/contacts',
      label: t.governmentContacts || 'Govt Officials & Contacts',
      icon: Building2,
      badge: 'NEW',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      href: '/analytics',
      label: t.analytics || 'Analytics & Impact',
      icon: BarChart3,
    },
  ];

  const operationalNavItems = [
    {
      href: '/authority',
      label: t.authorityQueue || 'Authority Queue',
      icon: Wrench,
      highlightRole: 'authority',
    },
    {
      href: '/moderator',
      label: t.moderationHub || 'Moderation Hub',
      icon: Shield,
      highlightRole: 'moderator',
    },
  ];

  const isLinkActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const renderNavLinks = (isMobile = false) => (
    <div className="space-y-6">
      {/* Primary Action Button */}
      <div className="px-2">
        <Link
          href="/report"
          onClick={() => isMobile && setMobileMenuOpen(false)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>{t.reportDefect || 'Report Defect'}</span>
        </Link>
      </div>

      {/* Core Civic Section */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          {language === 'te'
            ? 'పౌర సేవలు'
            : language === 'kn'
            ? 'ನಾಗರಿಕ ಸೇವೆಗಳು'
            : language === 'hi'
            ? 'नागरिक सेवाएं'
            : 'Civic Core'}
        </p>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active = isLinkActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                active
                  ? 'bg-blue-50 text-blue-700 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Public Escalation & Directory Section */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          {language === 'te'
            ? 'ప్రభుత్వ అధికారులు & సహాయం'
            : language === 'kn'
            ? 'ಸರ್ಕಾರಿ ಸಂಪರ್ಕ & ಸಹಾಯ'
            : language === 'hi'
            ? 'सरकारी संपर्क और सहायता'
            : 'Public Administration'}
        </p>
        {publicServiceNavItems.map((item) => {
          const Icon = item.icon;
          const active = isLinkActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                active
                  ? 'bg-blue-50 text-blue-700 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Authority & Moderation Section */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          {language === 'te'
            ? 'అధికారిక కార్యకలాపాలు'
            : language === 'kn'
            ? 'ಅಧಿಕಾರಿಯ ಕಾರ್ಯಸ್ಥಳ'
            : language === 'hi'
            ? 'अधिकारिक कार्यक्षेत्र'
            : 'Operations & Review'}
        </p>
        {operationalNavItems.map((item) => {
          const Icon = item.icon;
          const active = isLinkActive(item.href);
          const isUserRole = currentUser.role === item.highlightRole;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                active
                  ? 'bg-blue-50 text-blue-700 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {isUserRole && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Prominent Sidebar Language Switcher */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between px-3">
          <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-blue-600" />
            {t.selectLanguage || 'Language / భాష / ಭಾಷೆ'}
          </span>
          <span className="text-[10px] font-bold text-blue-600 uppercase">
            {language}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 px-2">
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  if (isMobile) setMobileMenuOpen(false);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-extrabold scale-[1.02]'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <span>{lang.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Persona / RBAC Switcher */}
      <div className="space-y-2 pt-2 border-t border-slate-100 px-2">
        <p className="px-1 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          {t.switchPersona || 'Switch User Persona'}
        </p>
        <RoleSwitcher />
      </div>

      {/* Trust & Integrity Indicators */}
      <div className="pt-2 border-t border-slate-100 px-3 space-y-1 text-[10px] text-slate-500 font-medium">
        <div className="flex items-center gap-1.5 text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AI Verifier: Online</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-700">
          <ShieldCheck className="w-3 h-3 text-blue-600" />
          <span>SHA-256 Ledger: Tamper-Proof</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* 1. FIXED DESKTOP LEFT SIDEBAR NAVIGATION */}
      <aside className="hidden lg:flex w-64 xl:w-72 flex-col fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/90 shadow-xs select-none">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  FixProof
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  AI Civic
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold tracking-tight -mt-0.5 line-clamp-1">
                {t.tagline || 'Reported. Repaired. Verified.'}
              </p>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-200">
          {renderNavLinks(false)}
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT WRAPPER */}
      <div className="lg:pl-64 xl:pl-72 flex-1 flex flex-col min-w-0 min-h-screen">
        {/* TOP STATUS & MOBILE NAVIGATION HEADER */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Mobile Hamburger & Logo */}
              <div className="flex items-center gap-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="Open left navigation menu"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    FixProof
                  </span>
                  <span className="text-[9px] font-bold uppercase px-1 py-0.5 rounded bg-blue-100 text-blue-700">
                    AI
                  </span>
                </Link>
              </div>

              {/* Desktop Breadcrumb / Live Notice */}
              <div className="hidden lg:flex items-center gap-3 text-xs text-slate-600">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-800 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.tagline || 'Reported. Repaired. Verified.'}</span>
                </div>
                <a
                  href="/contacts#emergency-helplines"
                  className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/80 font-bold transition-colors"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  <span>Helpline: 1533 (Pothole) / 1916 (Water)</span>
                </a>
              </div>

              {/* Right Utility Cluster: Language & Action */}
              <div className="flex items-center gap-2 sm:gap-3">
                <LanguageSelector />
                <div className="hidden sm:block">
                  <RoleSwitcher />
                </div>
                <Link
                  href="/report"
                  className="lg:hidden p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                  title={t.reportDefect || 'Report Defect'}
                >
                  <PlusCircle className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* 3. PAGE BODY */}
        <main className="flex-1 bg-slate-50">{children}</main>

        {/* 4. FOOTER */}
        <Footer />
      </div>

      {/* 5. MOBILE LEFT SIDEBAR OFF-CANVAS DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in-left z-50">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  FixProof
                </span>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  AI Civic
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-3">
              {renderNavLinks(true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

