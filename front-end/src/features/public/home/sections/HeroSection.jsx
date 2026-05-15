import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Lazy load images
import carousel1 from '../../../../assets/images/home/carousel1.png';
import carousel2 from '../../../../assets/images/home/carousel2.png';
import carousel3 from '../../../../assets/images/home/carousel3.png';
import carousel4 from '../../../../assets/images/home/carousel4.png';

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "./heroSection.module.css";

// Loading fallback component
const LoadingFallback = () => (
  <div className={styles.loadingFallback}>
    <div className={styles.spinner}></div>
  </div>
);

// Removed static domains array since we use useTranslation inside the component

function HeroSection() {
  const { t } = useTranslation("home");
  const [activeIndex, setActiveIndex] = useState(0);

  const domains = useMemo(() => [
    {
      id: "education",
      label: t("hero.education.label"),
      title: t("hero.education.title"),
      description: t("hero.education.description"),
      img: carousel1,
      ctaLink: "/domaines",
      ctaText: t("hero.education.cta")
    },
    {
      id: "health",
      label: t("hero.health.label"),
      title: t("hero.health.title"),
      description: t("hero.health.description"),
      img: carousel2,
      ctaLink: "/domaines",
      ctaText: t("hero.health.cta")
    },
    {
      id: "environment",
      label: t("hero.environment.label"),
      title: t("hero.environment.title"),
      description: t("hero.environment.description"),
      img: carousel3,
      ctaLink: "/domaines",
      ctaText: t("hero.environment.cta")
    },
    {
      id: "social",
      label: t("hero.social.label"),
      title: t("hero.social.title"),
      description: t("hero.social.description"),
      img: carousel4,
      ctaLink: "/domaines",
      ctaText: t("hero.social.cta")
    }
  ], [t]);

  // Memoize swiper configuration
  const swiperConfig = useMemo(() => ({
    modules: [Navigation, Pagination, Keyboard, Autoplay],
    navigation: true,
    keyboard: {
      enabled: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    loop: true,
    speed: 800,
    grabCursor: true,
    onSlideChange: (swiper) => setActiveIndex(swiper.realIndex),
    className: styles.swiper,
  }), []);

  const handleSlideChange = useCallback((swiper) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  // Preload adjacent images for better performance
  const preloadImage = useCallback((src) => {
    const img = new Image();
    img.src = src;
  }, []);

  const handlePreloadImages = useCallback((currentIndex) => {
    if (domains.length === 0) return;
    const nextIndex = (currentIndex + 1) % domains.length;
    const prevIndex = (currentIndex - 1 + domains.length) % domains.length;
    preloadImage(domains[nextIndex].img);
    preloadImage(domains[prevIndex].img);
  }, [preloadImage, domains]);

  // Handle swiper initialization
  const handleSwiperInit = useCallback((swiper) => {
    handlePreloadImages(0);
  }, [handlePreloadImages]);

  return (
    <section className={styles.heroSection} aria-label="Hero carousel">
      <div className={styles.container}>
        <Suspense fallback={<LoadingFallback />}>
          <Swiper
            {...swiperConfig}
            onSlideChange={handleSlideChange}
            onSwiper={handleSwiperInit}
          >
            {domains.map((domain, index) => (
              <SwiperSlide key={domain.id} className={styles.swiperSlide}>
                <div 
                  className={styles.slideContent}
                  style={{ backgroundImage: `url(${domain.img})` }}
                  loading={index === 0 ? "eager" : "lazy"}
                >
                  <h1 className={styles.title}>{domain.title}</h1>
                  <p className={styles.description}>{domain.description}</p>
                  <Link 
                    to={domain.ctaLink} 
                    className={styles.ctaButton}
                    aria-label={`Learn more about ${domain.label}`}
                  >
                    {domain.ctaText}
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Suspense>
      </div>
    </section>
  );
}

export default HeroSection;