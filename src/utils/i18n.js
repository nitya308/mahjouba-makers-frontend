import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';

export const languages = [
  {
    value: 'EN',
    label: 'English',
    nativeLabel: 'English',
  },
  {
    value: 'FR',
    label: 'French',
    nativeLabel: 'Française',
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