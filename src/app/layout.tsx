import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/AppLayout';
import { CivicAssistantWidget } from '@/components/CivicAssistantWidget';
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
      <body className="min-h-screen font-sans antialiased text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
        <AuthProvider>
          <LanguageProvider>
            <AppLayout>{children}</AppLayout>
            <CivicAssistantWidget />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

