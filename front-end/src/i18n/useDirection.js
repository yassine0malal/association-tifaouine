import { useEffect } from "react";
import { LANGUAGES } from "./languages";
import { useTranslation } from "react-i18next";


export default function useDirection() {
    const { i18n } = useTranslation();
    useEffect(() => {
        const lang = LANGUAGES.find(l => l.code === i18n.language);
        document.documentElement.dir = lang?.dir || "ltr";
    }, [i18n.language]);
}

