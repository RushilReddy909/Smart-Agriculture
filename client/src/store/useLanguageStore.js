import { create } from "zustand";
import en from "../locales/en.json";
import hi from "../locales/hi.json";
import chatt from "../locales/chatt.json";
import tel from "../locales/tel.json";
import ben from "../locales/ben.json";
import tam from "../locales/tam.json";
import mar from "../locales/mar.json";
import guj from "../locales/guj.json";
import kan from "../locales/kan.json";
import pun from "../locales/pun.json";

const LANG_STORAGE_KEY = "appLang";

const locales = {
  EN: en,
  HI: hi,
  TEL: tel,
  CHA: chatt,
  BEN: ben,
  TAM: tam,
  MAR: mar,
  GUJ: guj,
  KAN: kan,
  PUN: pun,
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
