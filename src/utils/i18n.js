import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';
import translationsAR from './locales/ar/translation.json';

export const languages = [
  {
    value: 'en',
    label: 'English',
    nativeLabel: 'English',
  },
  {
    value: 'fr',
    label: 'French',
    nativeLabel: 'Française',
  },
  {
    value: 'ar',
    label: 'Arabic',
    nativeLabel: 'عربي',
  },
];

const fallbackLng = ['en'];
const resources = {
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
  ar:{
    translation: translationsAR,
  },
};

const DETECTION_OPTIONS = {
  order: ['localStorage', 'navigator'],
  caches: ['localStorage'],
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng,
  detection: {
    DETECTION_OPTIONS,
    checkWhitelist: true,
  },
  debug: false,
  whitelist: languages.map((lang) => lang.value.toLowerCase()),
  interpolation: {
    escapevalue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;