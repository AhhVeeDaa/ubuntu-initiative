import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ubuntu Initiative | Mission Control Dashboard',
  description: 'Real-time Phase 0 progress tracking. Monitor the anchor tenant model powering Africa\'s sovereign AI infrastructure catalyst.',
  keywords: 'Dashboard, Mission Control, Phase 0, Milestone Tracking, Inga Dam Progress',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[hsl(var(--background))]">
      <body className={`${outfit.className} h-full`}>
        <Sidebar />
        <div className="md:pl-64 flex flex-col flex-1 h-full">
          <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

