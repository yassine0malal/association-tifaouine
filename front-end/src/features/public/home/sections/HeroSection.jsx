import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

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

const domains = [
  {
    id: "education",
    label: "Education & Literacy",
    title: "EDUCATION",
    description:
      "Promoting access to quality education through literacy programs, school support, and training initiatives for children and adults in rural communities.",
    img: carousel1,
    ctaLink: "/education",
    ctaText: "Learn More →"
  },
  {
    id: "health",
    label: "Health & Well-being",
    title: "HEALTH",
    description:
      "Improving community health through medical caravans, awareness campaigns, and access to basic healthcare services in underserved areas.",
    img: carousel2,
    ctaLink: "/health",
    ctaText: "Learn More →"
  },
  {
    id: "environment",
    label: "Environment & Sustainability",
    title: "SUSTAINABILITY",
    description:
      "Protecting natural resources by organizing environmental campaigns, promoting sustainable practices, and supporting local ecological initiatives.",
    img: carousel3,
    ctaLink: "/environment",
    ctaText: "Learn More →"
  },
  {
    id: "social",
    label: "Social Development & Solidarity",
    title: "SOLIDARITY",
    description:
      "Strengthening social cohesion by supporting vulnerable groups, organizing solidarity actions, and fostering community engagement and inclusion.",
    img: carousel4,
    ctaLink: "/social",
    ctaText: "Learn More →"
  }
];

function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Memoize swiper configuration
  const swiperConfig = useMemo(() => ({
    modules: [Navigation, Pagination, Keyboard, Autoplay],
    navigation: true,
    keyboard: {
      enabled: true,
    },
    autoplay: {
      delay: 5000,
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

  // Preload next and previous images
  const handlePreloadImages = useCallback((currentIndex) => {
    const nextIndex = (currentIndex + 1) % domains.length;
    const prevIndex = (currentIndex - 1 + domains.length) % domains.length;
    preloadImage(domains[nextIndex].img);
    preloadImage(domains[prevIndex].img);
  }, [preloadImage]);

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