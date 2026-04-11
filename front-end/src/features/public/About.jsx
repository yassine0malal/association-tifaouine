import React, { useRef, useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useAnimationFrame
} from 'framer-motion';
import association from "../../assets/images/about-us.png"
import checked from "../../assets/icons/checked.png"
import HeroBg from "../../assets/images/projects_hero.jpg"
import call from "../../assets/icons/call.png"
import arrow from "../../assets/icons/arrow-right.png"
//Partenairs
import agriculture from "../../assets/images/partenaires/agriculture.png"
import analphabetisme from "../../assets/images/partenaires/analphabitisme.png"
import anapec from "../../assets/images/partenaires/anapec.png"
import entraide from "../../assets/images/partenaires/entraide-nationale.png"
import equipement from "../../assets/images/partenaires/equipement.png"
import habous from "../../assets/images/partenaires/habous.png"
import province from "../../assets/images/partenaires/province-el-haouz.png"
import travail from "../../assets/images/partenaires/travail.png"
import bgImage from "../../assets/images/partenaires/bg-image.png"
// Import CSS Module
import styles from './About.module.css';
import PageHero from '../../components/common/PageHero';
import Btn from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const teamData = [
  { id: 1, src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80", title: "Real-Time Collaboration", desc: "Communicate seamlessly and keep everyone in sync." },
  { id: 2, src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80", title: "Task & Project Tracking", desc: "Assign tasks, set deadlines, and visualize progress." },
  { id: 3, src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80", title: "Performance Insights", desc: "Make smarter decisions with real-time analytics." },
  { id: 4, src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80", title: "Real-Time Collaboration", desc: "Communicate seamlessly and keep everyone in sync." },
  { id: 5, src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80", title: "Task & Project Tracking", desc: "Assign tasks, set deadlines, and visualize progress." },
  { id: 6, src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80", title: "Performance Insights", desc: "Make smarter decisions with real-time analytics." },
];
const partners = [
  { id: 1, title: "Project 1", image: agriculture },
  { id: 2, title: "Project 2", image: analphabetisme },
  { id: 3, title: "Project 3", image: anapec },
  { id: 4, title: "Project 4", image: entraide },
  { id: 5, title: "Project 5", image: equipement },
  { id: 6, title: "Project 6", image: habous },
  { id: 7, title: "Project 7", image: province },
  { id: 8, title: "Project 8", image: travail },
]

const infiniteData = [...teamData, ...teamData, ...teamData];

const About = () => {
  const [trackWidth, setTrackWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const [index, setIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);
  const { t } = useTranslation("about");
  const [isRTL, setIsRTL] = useState(i18n.language === "ar");
  const isRTLRef = useRef(i18n.language === "ar");

  console.log("🟡 MOUNT — i18n.language:", i18n.language, "| isRTL:", i18n.language === "ar");
  console.log("🟡 MOUNT — document.dir:", document.documentElement.dir);

  const maxindex = partners.length - visibleItems;
  const next = () => {
    setIndex((prev) => (prev < maxindex ? prev + 1 : 0))
  }
  const prev = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : maxindex))
  }

  useEffect(() => {
    const updateDirection = (lng) => {
      console.log("🔵 languageChanged fired — lng:", lng, "| rtl:", lng === "ar", "| trackWidth:", trackWidth);

      const rtl = lng === "ar";
      isRTLRef.current = rtl;
      setIsRTL(rtl);
      setIndex(0);

      if (trackWidth > 0) {
        x.set(0); // ← reset simple à zéro
      } else {
        console.warn("⚠️ languageChanged fired but trackWidth is 0 — x was NOT reset!");
      }
    };

    i18n.on("languageChanged", updateDirection);
    return () => i18n.off("languageChanged", updateDirection);
  }, [trackWidth]);

  useEffect(() => {
    const updateWidth = () => {
      if (trackRef.current) {
        // With 3 copies, the width of one copy = scrollWidth / 3
        const measured = trackRef.current.scrollWidth / 3;
        console.log("📐 trackWidth measured:", measured, "| scrollWidth:", trackRef.current.scrollWidth);
        setTrackWidth(measured);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleDragEnd = () => {
    setIsPaused(false);
    let currentX = x.get();

    if (isRTLRef.current) {
      // RTL: wrap within [0, trackWidth]
      while (currentX > trackWidth) currentX -= trackWidth;
      while (currentX < 0) currentX += trackWidth;
    } else {
      // LTR: wrap within [-trackWidth, 0]
      while (currentX < -trackWidth) currentX += trackWidth;
      while (currentX > 0) currentX -= trackWidth;
    }
    x.set(currentX);
  };



  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleItems(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(4)
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (trackWidth > 0) {
      x.set(0); // ← toujours 0, quelle que soit la langue
    }
  }, [trackWidth]);


  // Add a counter so it only logs every 120 frames (not every frame)

  useAnimationFrame((t, delta) => {
    if (isPaused || trackWidth === 0) return;

    const direction = isRTLRef.current ? 1 : -1;
    const moveBy = direction * 0.05 * delta;
    let newX = x.get() + moveBy;

    // Symmetric rebound for LTR and RTL
    if (isRTLRef.current) {
      // RTL: keep x between 0 and trackWidth
      if (newX > trackWidth) newX -= trackWidth;
      else if (newX < 0) newX += trackWidth;
    } else {
      // LTR: keep x between -trackWidth and 0
      if (newX < -trackWidth) newX += trackWidth;
      else if (newX > 0) newX -= trackWidth;
    }

    x.set(newX);
  });
  return (
    <>
      <PageHero title={t('hero.title')} heroImg={HeroBg} />
      <div className={styles.AboutSection}>

        <div className={styles.associationDescription}>

          {/* ----First section of the definition of the association-----  */}
          <div className={styles.imageWrapper}>
            <img src={association} alt="tifaouine" />
          </div>
          <div className={styles.description}>
            <p>{t('intro.question')}</p>
            <h2>{t('intro.title')}</h2>
            <p>
              {t('intro.description')}
            </p>

            <div className={styles.options}>
              <div className={styles.optionWarper}>
                <img src={checked} alt="task" />
                <p><b>{t('objectives.desenclaver').split(' ')[0]}</b> {t('objectives.desenclaver').split(' ').slice(1).join(' ')}</p>
              </div>
              <div className={styles.optionWarper}>
                <img src={checked} alt="task" />
                <p><b>{t('objectives.eduquer').split(' ')[0]}</b> {t('objectives.eduquer').split(' ').slice(1).join(' ')}</p>
              </div>
              <div className={styles.optionWarper}>
                <img src={checked} alt="task" />
                <p><b>{t('objectives.promouvoir').split(' ')[0]}</b> {t('objectives.promouvoir').split(' ').slice(1).join(' ')}</p>
              </div>

              <div className={styles.interaction}>
                <div className={styles.button}>
                  <Btn title={t('actions.don')} />
                </div>
                <div className={styles.phone}>
                  <img src={call} alt="" />
                  <p className="phoneNumber">{t('actions.phone')}</p>
                </div>
              </div>


            </div>

          </div>


        </div>

        <div className={styles.hashtage}>
          <h3>{t('stats.title')}</h3>

          <p>{t('stats.list')}</p>
        </div>





        {/* Carousel Card */}
        <div className={styles.carouselWrapper}>
          <h2>{t('team.title')}</h2>
          <motion.div
            ref={trackRef}
            className={styles.carouselTrack}
            drag="x"
            style={{ x }}
            onDragStart={() => setIsPaused(true)}
            onDragEnd={handleDragEnd}   // ← use the new handler
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {infiniteData.map((item, index) => (
              <CarouselCard key={index} item={item} styles={styles} />
            ))}
          </motion.div>

        </div>



        <div className={styles.partenaires}>
          <h2>{t('partners.title')}</h2>
          <div
            className={styles.slide}
          >
            <motion.div
              animate={{
                x: isRTL
                  ? `${index * (100 / visibleItems)}%`
                  : `-${index * (100 / visibleItems)}%`
              }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className={styles.partenairesImages}
            >

              {partners.map((p) => (
                <div
                  key={p.id}
                  className={styles.partnerCard}
                  style={{ minWidth: `${100 / visibleItems}%` }}
                >

                  <img src={p.image} alt={p.title} />
                </div>
              ))}

            </motion.div>
          </div>

          <div className={styles.buttons}>
            <button onClick={prev} > <img src={arrow} /> </button>
            <button onClick={next} > <img src={arrow} /> </button>
          </div>


        </div>

      </div >
    </>
  );
}
const CarouselCard = ({ item, styles }) => {
  return (
    <div className={styles.cardGroup}>
      <motion.div
        className={styles.carouselCard}
        whileTap={{ cursor: "grabbing" }}
      >
        <img src={item.src} alt={item.title} draggable="false" />
      </motion.div>

      <div className={styles.cardFooter}>
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
      </div>
    </div>
  );
};

export default About;