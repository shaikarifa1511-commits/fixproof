import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { AuthProvider } from '@/lib/auth/context';
import { LanguageProvider } from '@/lib/i18n/context';

export const metadata: Metadata = {
  title: 'FixProof — Reported. Repaired. Verified.',
  description:
    'A complaint marked "Fixed" does not prove it was actually fixed. FixProof verifies civic repair claims using photographic evidence, tamper checks, and transparent AI-assisted comparison.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans antialiased text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                    FP
                  </div>
                  <span className="font-semibold text-slate-700">FixProof Platform</span>
                  <span>— "Reported. Repaired. Verified."</span>
                </div>

                <div className="text-center md:text-right space-y-0.5">
                  <p>Independent Civic Verification & Computer Vision Infrastructure.</p>
                  <p className="text-[11px] text-slate-400">
                    Compliant with WCAG 2.2 AA accessibility guidelines. DPDP Act privacy principles.
                  </p>
                </div>
              </div>
            </footer>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
