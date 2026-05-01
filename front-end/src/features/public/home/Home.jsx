import { useTranslation } from "react-i18next";
import PartnerSection from "./sections/PartnerSection";
import EventSection from "./sections/EventSection";
import TestimonialSection from "./sections/TestimonialSection";
import WorkProcessSection from "./sections/WorkProcessSection";

export default function Home() {
    const { t } = useTranslation("home");
    // const { lang } = useParams();
    return (
        <div>
            <WorkProcessSection t={t} />
            <EventSection t={t} />
            <PartnerSection t={t} />
            <TestimonialSection t={t} />
        </div>
    );
}