'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('en');
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    // Get locale from cookie
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='));
    const cookieLocale = localeCookie?.split('=')[1] || 'en';
    
    setLocale(cookieLocale);

    // Load messages
    import(`../../messages/${cookieLocale}.json`)
      .then(mod => setMessages(mod.default))
      .catch(() => import(`../../messages/en.json`)
        .then(mod => setMessages(mod.default)));
  }, []);

  if (!messages) {
    return <>{children}</>;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
