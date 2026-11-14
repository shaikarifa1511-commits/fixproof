'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/context';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
            FP
          </div>
          <span className="font-semibold text-slate-700">FixProof Platform</span>
          <span>— "{t?.tagline || 'Reported. Repaired. Verified.'}"</span>
        </div>

        <div className="text-center md:text-right space-y-0.5">
          <p>{t?.footerRights || 'Independent Civic Verification & Computer Vision Infrastructure.'}</p>
          <p className="text-[11px] text-slate-400">
            {t?.footerPrivacy || 'Compliant with WCAG 2.2 AA accessibility guidelines. DPDP Act privacy principles.'}
          </p>
        </div>
      </div>
    </footer>
  );
}

