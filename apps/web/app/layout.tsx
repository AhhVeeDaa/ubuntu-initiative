import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ubuntu Initiative | Sovereign Intelligence',
  description: "Powering Africa's future with the world's first sovereign AI supercomputer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
