import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import httpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(httpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "fr",
        supportedLngs: ["fr", "en", "ar"], // N'accepte que ces 3 langues
        nonExplicitSupportedLngs: true,    // Aide i18next à comprendre que en-US = en
        load: "languageOnly",
        
        debug: false,
        ns: ["common", "home", "about", "contact"],
        defaultNs: "common",
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json"
        },
        interpolation: {
            escapeValue: false
        }
    });

const applyLanguageSettings = (lng) => {
    document.body.classList.remove("ar");

    if (lng === "ar") {
        document.body.classList.add("ar");
    }

    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng; // seo
};

// --- INTERCEPTION DES LANGUES COMPOSÉES (ex: en-US -> en) ---
i18n.on("languageChanged", (lng) => {
    // Si la langue contient un tiret, on coupe et on force la version courte
    if (lng && lng.includes("-")) {
        i18n.changeLanguage(lng.split("-")[0]);
    } else {
        // Sinon on applique les paramètres (RTL/LTR) normalement
        applyLanguageSettings(lng);
    }
});

// Vérification au tout premier chargement de la page
const initialLang = i18n.language || "fr";
if (initialLang.includes("-")) {
    i18n.changeLanguage(initialLang.split("-")[0]);
} else {
    applyLanguageSettings(initialLang);
}
// -----------------------------------------------------------

export default i18n;