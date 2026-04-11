import { useTranslation } from "react-i18next";


export default function Home() {
    const { t } = useTranslation("home");
    return (
        <div>
            <h1>{t("title")}</h1>
            <p>{t("description")}</p>
        </div>
    );
}