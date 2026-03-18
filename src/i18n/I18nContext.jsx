import React from 'react';
import { messages } from './messages';

const I18nContext = React.createContext(null);

const STORAGE_KEY = 'vda_lang';

function getInitialLang() {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'en' || saved === 'zh') return saved;
  const browser = window.navigator.language?.toLowerCase() || '';
  return browser.startsWith('zh') ? 'zh' : 'en';
}

function getByPath(target, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), target);
}

export function I18nProvider({ children }) {
  const [lang, setLang] = React.useState(getInitialLang);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    }
  }, [lang]);

  const toggleLang = React.useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'zh' : 'en'));
  }, []);

  const tx = React.useCallback(
    (enText, zhText) => (lang === 'zh' ? zhText : enText),
    [lang]
  );

  const t = React.useCallback(
    (key, fallback = '') => {
      const value = getByPath(messages, key);
      if (value == null) return fallback || key;
      if (value && typeof value === 'object' && 'en' in value && 'zh' in value) {
        return lang === 'zh' ? value.zh : value.en;
      }
      return value;
    },
    [lang]
  );

  const value = React.useMemo(
    () => ({ lang, setLang, toggleLang, tx, t }),
    [lang, toggleLang, tx, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return ctx;
}
