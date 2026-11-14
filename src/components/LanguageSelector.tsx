'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { SupportedLanguage } from '@/lib/i18n/translations';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const options: Array<{ code: SupportedLanguage; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  ];

  return (
    <div className="relative inline-flex items-center">
      <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
        className="pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        aria-label="Select Language"
      >
        {options.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
