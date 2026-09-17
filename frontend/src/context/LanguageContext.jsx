import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import en from '../i18n/en';
import hi from '../i18n/hi';

const dictionaries = { en, hi };
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('lang');
    return saved && dictionaries[saved] ? saved : 'en';
  });

  const setLang = useCallback((code) => {
    if (dictionaries[code]) {
      setLangState(code);
      localStorage.setItem('lang', code);
    }
  }, []);

  const t = useMemo(() => {
    const dict = dictionaries[lang] || dictionaries.en;
    return (key) => dict[key] || dictionaries.en[key] || key;
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t }),
    [lang, setLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}