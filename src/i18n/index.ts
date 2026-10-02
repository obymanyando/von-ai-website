import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
// TODO: re-enable FI. fi.json still holds the old offer (including its price),
// so it is not imported, and therefore not shipped in the bundle, until the
// redesign is translated.
// import fi from "./locales/fi.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      // fi: { translation: fi },
    },
    // TODO: re-enable FI. fi.json still holds the old offer's copy, so English
    // is forced until the Finnish translation of the redesign exists. Remove
    // `lng` to let the detector below pick the language again.
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
