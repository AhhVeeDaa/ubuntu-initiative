import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import { Outfit } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/components/providers/I18nProvider';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Ubuntu Initiative | Africa\'s Sovereign AI Supercomputer',
  description: 'Powering the future of African intelligence via the Inga Falls hydropower expansion. An anchor-tenant model for continental electrification.',
  keywords: 'Africa AI, Sovereign AI, Inga Dam, Hydropower, AI Supercomputer, Congo River, Infrastructure Catalyst, Clean Energy',
  openGraph: {
    title: 'Ubuntu Initiative | Africa\'s Sovereign AI Supercomputer',
    description: 'The anchor tenant that makes Inga Dam bankable. 500MW baseload demand unlocking 42,000MW of clean energy for Africa.',
    type: 'website',
  },
};

import { IngaFloatingButton } from '@/components/ai/IngaFloatingButton';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans antialiased">
        <I18nProvider>
          {children}
          <IngaFloatingButton />
        </I18nProvider>
      </body>
    </html>
  );
}
