'use client';

import React, { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'ln', name: 'Lingala', flag: '🇨🇩', nativeName: 'Lingala' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿', nativeName: 'Kiswahili' }
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(() => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='));
      return localeCookie?.split('=')[1] || 'en';
    }
    return 'en';
  });

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const handleLanguageChange = (locale: string) => {
    // Set cookie for locale preference
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    
    setCurrentLocale(locale);
    setIsOpen(false);
    
    // Reload page to apply new locale
    window.location.reload();
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 transition-all duration-200"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium text-white">
          {currentLanguage.flag} {currentLanguage.nativeName}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/50">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Globe className="w-4 h-4 text-blue-400" />
                Select Language
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Choose your preferred language
              </p>
            </div>

            {/* Language Options */}
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`
                    w-full px-4 py-3 flex items-center justify-between
                    hover:bg-slate-700/50 transition-colors duration-150
                    ${currentLocale === language.code ? 'bg-slate-700/30' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{language.flag}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">
                        {language.nativeName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {language.name}
                      </div>
                    </div>
                  </div>
                  
                  {currentLocale === language.code && (
                    <Check className="w-5 h-5 text-green-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-700 bg-slate-900/50">
              <p className="text-xs text-slate-500 leading-relaxed">
                🌍 Supporting African languages including Lingala and Kiswahili
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Compact version for mobile
export function CompactLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(() => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='));
      return localeCookie?.split('=')[1] || 'en';
    }
    return 'en';
  });

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const handleLanguageChange = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    setCurrentLocale(locale);
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 flex items-center justify-center transition-all duration-200"
        title="Change Language"
        aria-label="Change language"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`
                  w-full px-3 py-2 flex items-center gap-3
                  hover:bg-slate-700/50 transition-colors
                  ${currentLocale === language.code ? 'bg-slate-700/30' : ''}
                `}
              >
                <span className="text-xl">{language.flag}</span>
                <span className="text-sm text-white">{language.name}</span>
                {currentLocale === language.code && (
                  <Check className="w-4 h-4 text-green-400 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
