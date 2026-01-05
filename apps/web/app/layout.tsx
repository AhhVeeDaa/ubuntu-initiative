import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'] });

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

// ... (previous imports)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {children}
        <IngaFloatingButton />
      </body>
    </html>
  );
}
