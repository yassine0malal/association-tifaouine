import { useTranslation } from "react-i18next";
import PartnerSection from "./sections/PartnerSection";
import EventSection from "./sections/EventSection";
import TestimonialSection from "./sections/TestimonialSection";
import WorkProcessSection from "./sections/WorkProcessSection";
import HeroSection from "./sections/HeroSection";

export default function Home() {
    const { t } = useTranslation("home");
    // const { lang } = useParams();
    return (
        <div>
            <HeroSection />
            <WorkProcessSection t={t} />
            <EventSection t={t} />
            <PartnerSection t={t} />
            <TestimonialSection t={t} />
        </div>
    );
}