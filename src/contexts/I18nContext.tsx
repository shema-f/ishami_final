import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'en' | 'rw';

type Dict = Record<string, string>;

interface I18nCtx {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, fallback?: string) => string;
}

const STORAGE_KEY = 'ishami.lang';

const I18nContext = createContext<I18nCtx | undefined>(undefined);

// ── Translation sources: per-page JSON files in src/locales/{en,rw} ──
// Each file holds a nested object whose root keys are the namespaces used by
// components (e.g. home.json -> { home: { hero: { title: "…" } } }) and whose
// leaves are flat dotted keys such as "home.hero.title".
const localeModules: Record<Lang, Record<string, Dict>> = {
  en: import.meta.glob('../locales/en/*.json', { eager: true, import: 'default' }) as Record<string, Dict>,
  rw: import.meta.glob('../locales/rw/*.json', { eager: true, import: 'default' }) as Record<string, Dict>,
};

/** Flatten a nested JSON object into a map of dotted keys (arrays are skipped). */
function flatten(value: unknown, prefix = '', out: Dict = {}): Dict {
  if (value !== null && typeof value === 'object') {
    if (Array.isArray(value)) return out;
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out);
    }
  } else if (typeof value === 'string') {
    out[prefix] = value;
  }
  return out;
}

function buildDict(modules: Record<string, Dict>): Dict {
  const dict: Dict = {};
  for (const file of Object.keys(modules)) {
    Object.assign(dict, flatten(modules[file]));
  }
  return dict;
}

const dictionaries: Record<Lang, Dict> = {
  en: buildDict(localeModules.en),
  rw: buildDict(localeModules.rw),
};

const detectInitial = (): Lang => {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === 'en' || saved === 'rw') return saved;
    const nav = (navigator.language || 'en').toLowerCase();
    if (nav.startsWith('rw') || nav.startsWith('kin')) return 'rw';
    return 'en';
  } catch {
    return 'en';
  }
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectInitial());

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    try {
      document.documentElement.lang = lang === 'rw' ? 'rw' : 'en';
    } catch {}
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback((key: string, fallback?: string) => {
    return dictionaries[lang][key] ?? fallback ?? key;
  }, [lang]);

  const value = useMemo<I18nCtx>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used inside <I18nProvider>');
  }
  return ctx;
}
