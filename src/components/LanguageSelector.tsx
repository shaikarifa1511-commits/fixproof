'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { SupportedLanguage } from '@/lib/i18n/translations';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageOption {
  code: SupportedLanguage;
  nativeLabel: string;
  englishLabel: string;
  region: string;
}

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: LanguageOption[] = [
    {
      code: 'en',
      nativeLabel: 'English',
      englishLabel: 'English',
      region: 'International',
    },
    {
      code: 'te',
      nativeLabel: 'తెలుగు',
      englishLabel: 'Telugu',
      region: 'ఆంధ్రప్రదేశ్ / తెలంగాణ',
    },
    {
      code: 'kn',
      nativeLabel: 'ಕನ್ನಡ',
      englishLabel: 'Kannada',
      region: 'ಕರ್ನಾಟಕ',
    },
    {
      code: 'hi',
      nativeLabel: 'हिंदी',
      englishLabel: 'Hindi',
      region: 'भारत',
    },
  ];

  const currentLanguage = languages.find((l) => l.code === language) || languages[0];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Primary Language Navigation Link / Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200/80 bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 text-xs font-bold shadow-2xs hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={t?.changeLanguage || 'Switch Language'}
      >
        <Globe className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
        <span className="font-extrabold tracking-tight text-blue-950">
          {currentLanguage.nativeLabel}
        </span>
        <span className="text-[10px] text-blue-600 font-normal hidden sm:inline">
          ({currentLanguage.englishLabel})
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-blue-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Language Selection Popover Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-200/90 py-2 z-40 animate-fade-in divide-y divide-slate-100">
            <div className="px-3.5 py-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {t?.selectLanguage || 'Select Language'} / భాషను ఎంచుకోండి / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ
              </p>
            </div>

            <div className="py-1">
              {languages.map((item) => {
                const isSelected = language === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleSelectLanguage(item.code)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-blue-50/90 text-blue-900 font-black'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{item.nativeLabel}</span>
                        <span className="text-[11px] text-slate-400">({item.englishLabel})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">{item.region}</span>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
