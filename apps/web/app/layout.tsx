import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import { Outfit } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { cookies } from 'next/headers';
import { locales, defaultLocale } from '@/i18n';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const BASE_URL = 'https://ubuntu-initiative.org';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Ubuntu Initiative | Africa\'s Sovereign AI Supercomputer',
  description: 'Powering the future of African intelligence via the Inga Falls hydropower expansion. An anchor-tenant model for continental electrification.',
  keywords: 'Africa AI, Sovereign AI, Inga Dam, Hydropower, AI Supercomputer, Congo River, Infrastructure Catalyst, Clean Energy',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ubuntu Initiative | Africa\'s Sovereign AI Supercomputer',
    description: 'Powering the future of African intelligence via the Inga Falls hydropower expansion. An anchor-tenant model for continental electrification.',
    creator: '@UbuntuInitiative',
  },
  alternates: {
    canonical: BASE_URL,
    languages: Object.fromEntries(locales.map((locale) => [locale, `${BASE_URL}/${locale}`])),
  },
  openGraph: {
    title: 'Ubuntu Initiative | Africa\'s Sovereign AI Supercomputer',
    description: 'The anchor tenant that makes Inga Dam bankable. 500MW baseload demand unlocking 42,000MW of clean energy for Africa.',
    type: 'website',
    url: BASE_URL,
    siteName: 'Ubuntu Initiative',
    locale: 'en',
    images: [
      {
        url: `${BASE_URL}/hero-inga-dam-datacenter.jpg`,
        width: 1200,
        height: 630,
        alt: 'Ubuntu Initiative — Africa\'s Sovereign AI Supercomputer',
      },
    ],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ubuntu Initiative',
  description: 'Africa\'s Sovereign AI Supercomputer — Powering the future of African intelligence via the Inga Falls hydropower expansion.',
  url: BASE_URL,
  sameAs: [],
};

import { IngaFloatingButton } from '@/components/ai/IngaFloatingButton';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;
  const lang = locales.includes(localeCookie as typeof locales[number]) ? localeCookie : defaultLocale;

  return (
    <html lang={lang} role="document" className={outfit.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black"
        >
          Skip to main content
        </a>
        <I18nProvider>
          {children}
          <IngaFloatingButton />
        </I18nProvider>
      </body>
    </html>
  );
}
