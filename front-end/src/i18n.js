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

    document.documentElement.lang = lng; //seo
};

i18n.on("languageChanged", (lng) => {
    applyLanguageSettings(lng);
});

applyLanguageSettings(i18n.language);


export default i18n;