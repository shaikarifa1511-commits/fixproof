import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
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
      <body className="min-h-screen flex flex-col font-sans antialiased text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1">{children}</main>

            <Footer />
            <CivicAssistantWidget />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

