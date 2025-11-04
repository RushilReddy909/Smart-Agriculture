import { create } from "zustand";
import en from "../locales/en.json";
import hi from "../locales/hi.json";
import chatt from "../locales/chatt.json";
import tel from "../locales/tel.json";

const LANG_STORAGE_KEY = "appLang";

const locales = {
  EN: en,
  HI: hi,
  TEL: tel,
  CHA: chatt,
};

const getInitialLang = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(LANG_STORAGE_KEY) || "EN";
  }
  return "EN";
};

const useLanguageStore = create((set, get) => ({
  currentLang: getInitialLang(),
  locales: locales,

  setLanguage: (lang) => {
    if (locales[lang]) {
      set({ currentLang: lang });
      if (typeof window !== "undefined") {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
      }
    }
  },

  t: (key) => {
    const { currentLang, locales } = get();
    const translation = locales[currentLang];

    const keys = key.split(".");
    let result = translation;
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        // Fallback to the key itself if translation is missing
        return key;
      }
    }
    return result;
  },
}));

export default useLanguageStore;