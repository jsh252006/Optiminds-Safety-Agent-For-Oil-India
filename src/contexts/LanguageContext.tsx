import { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from '../lib/translations';

type LanguageCode = 'en' | 'hi';
type LanguageLabel = 'English' | 'Hindi';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languageName: LanguageLabel;
  setLanguageByName: (name: LanguageLabel) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const languageName = language === 'en' ? 'English' : 'Hindi';

  const setLanguageByName = (name: LanguageLabel) => {
    if (name === 'English') setLanguage('en');
    else if (name === 'Hindi') setLanguage('hi');
    
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageName, setLanguageByName, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
