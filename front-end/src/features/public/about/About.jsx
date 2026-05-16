import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useAnimationFrame
} from 'framer-motion';

import association from "../../../assets/images/about-us.png"
import checked from "../../../assets/icons/checked.png"
import HeroBg from "../../../assets/images/projects_hero.jpg"
import bg from "../../../assets/images/bg.png"
import call from "../../../assets/icons/call.png"
import arrow from "../../../assets/icons/arrow-right.png"
//Partenairs
import agriculture from "../../../assets/images/partenaires/agriculture.png"
import analphabetisme from "../../../assets/images/partenaires/analphabitisme.png"
import anapec from "../../../assets/images/partenaires/anapec.png"
import entraide from "../../../assets/images/partenaires/entraide-nationale.png"
import equipement from "../../../assets/images/partenaires/equipement.png"
import habous from "../../../assets/images/partenaires/habous.png"
import province from "../../../assets/images/partenaires/province-el-haouz.png"
import travail from "../../../assets/images/partenaires/travail.png"
import bgImage from "../../../assets/images/partenaires/bg-image.png"
import { fetchPartenaires } from './partnerSlice';
//Import gallery images
import centre from "../../../assets/images/about/centre.png"
import energy from "../../../assets/images/about/energy.jpeg"
import science from "../../../assets/images/about/science.png"
import nature from "../../../assets/images/about/nature.jpg"
import children from "../../../assets/images/about/children.jpg"
import defaultPartner from "../../../assets/images/default-partner.png"

// Import CSS Module
import styles from './About.module.css';
import PageHero from '../../../components/common/PageHero';
import Btn from '../../../components/common/Button';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembres } from './membresSlice';

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

const About = () => {
  const { membres: teamData, loading, error } = useSelector((state) => state.membres);
  const { partenaires: partners, loading: partenairesLoading } = useSelector((state) => state.partenaires);
  const dispatch = useDispatch();
  
  const [trackWidth, setTrackWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [index, setIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);
  const { t } = useTranslation("about");
  const [isRTL, setIsRTL] = useState(i18n.language === "ar");
  const isRTLRef = useRef(i18n.language === "ar");
  const lang = i18n.language;

  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const tiltRefs = useRef(new Map());

  // Refs for custom drag tracking and inertia physics
  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);

  const infiniteData = [...teamData, ...teamData, ...teamData];

  const setTitlRef = useCallback((element, id) => {
    if (element) {
      VanillaTilt.init(element, {
        max: 20,
        speed: 500,
        perspective: 1000,
        glare: true,
        "max-glare": 0.6,
        scale: 1.05,
        reverse: false,
        "mouse-event-element": ".tilt-trigger"
      });
      tiltRefs.current.set(id, element);
    }
  }, []);

  const maxindex = partners.length - visibleItems;
  const next = () => {
    setIndex((prev) => (prev < maxindex ? prev + 1 : 0))
  }
  const prev = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : maxindex))
  }

  useEffect(() => {
    dispatch(fetchMembres({ lang }));
    dispatch(fetchPartenaires({ lang }));
  }, [lang]);

  useEffect(() => {
    const updateDirection = (lng) => {
      const rtl = lng === "ar";
      isRTLRef.current = rtl;
      setIsRTL(rtl);
      setIndex(0);
      x.set(0);
    };

    i18n.on("languageChanged", updateDirection);
    return () => i18n.off("languageChanged", updateDirection);
  }, [trackWidth]);

  useEffect(() => {
    const updateWidth = () => {
      if (trackRef.current) {
        const measured = trackRef.current.scrollWidth / 3;
        setTrackWidth(measured);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [teamData]);

  useEffect(() => {
    if (trackWidth > 0) {
      x.set(0);
    }
  }, [trackWidth]);

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

  // Custom unified pointer handlers for ultra-smooth tracking
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    lastPointerXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || trackWidth === 0) return;

    const currentTime = performance.now();
    const timeDelta = currentTime - lastTimeRef.current;
    const currentPointerX = e.clientX;
    const pointerDeltaX = currentPointerX - lastPointerXRef.current;

    // Calculate drag velocity scaled to standard ~60fps frames
    if (timeDelta > 0) {
      const instantVelocity = (pointerDeltaX / timeDelta) * 16.666;
      velocityRef.current = velocityRef.current * 0.6 + instantVelocity * 0.4; // smooth velocity jitter
    }

    let newX = x.get() + pointerDeltaX;

    // Instant seamless wrapping DURING manual drag tracking
    if (isRTLRef.current) {
      while (newX > trackWidth) newX -= trackWidth;
      while (newX < 0) newX += trackWidth;
    } else {
      while (newX < -trackWidth) newX += trackWidth;
      while (newX > 0) newX -= trackWidth;
    }

    x.set(newX);

    lastPointerXRef.current = currentPointerX;
    lastTimeRef.current = currentTime;
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // High performance unified loop for auto-scroll + momentum deceleration
  useAnimationFrame((t, delta) => {
    if (trackWidth === 0 || isDraggingRef.current) return;

    let currentX = x.get();

    if (Math.abs(velocityRef.current) > 0.1) {
      // Apply smooth momentum coasting after release
      currentX += velocityRef.current * (delta / 16.666);
      velocityRef.current *= 0.95; // Friction value
    } else {
      // Apply clean auto-scroll if idle
      if (!isHovered) {
        const direction = isRTLRef.current ? 1 : -1;
        const moveBy = direction * 0.05 * delta;
        currentX += moveBy;
      }
    }

    // Seamless wrapper guard rails
    if (isRTLRef.current) {
      while (currentX > trackWidth) currentX -= trackWidth;
      while (currentX < 0) currentX += trackWidth;
    } else {
      while (currentX < -trackWidth) currentX += trackWidth;
      while (currentX > 0) currentX -= trackWidth;
    }

    x.set(currentX);
  });

  return (
    <>
      <PageHero title={t('hero.title')} heroImg={bg} />
      <div className={styles.AboutSection}>

        <div className={styles.associationDescription}>
          <div className={styles.imageWrapper}>
            <img src={association} alt="tifaouine" />
          </div>
          <div className={styles.description}>
            <p>{t('intro.question')}</p>
            <h2>{t('intro.title')}</h2>
            <p>{t('intro.description')}</p>

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

        {/* Improved Interactive Carousel Wrapper */}
        <div className={styles.carouselWrapper}>
          <h2>{t('team.title')}</h2>
          <motion.div
            ref={trackRef}
            className={styles.carouselTrack}
            style={{ x, touchAction: 'none', cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              isDraggingRef.current = false;
            }}
          >
            {infiniteData.map((item, index) => (
              <CarouselCard key={index} item={item} styles={styles} />
            ))}
          </motion.div>
        </div>

        {/* ----- Numbers Section ---- */}
        <div className={styles.impact}>
          <p>{t('impact.label')}</p>
          <h1>{t('impact.title')}</h1>

          <section>
            {t('impact.items', { returnObjects: true }).map((item, index) => (
              <article key={index} ref={(el) => setTitlRef(el, index + 1)}>
                <div className={styles.cercle}>
                  {index === 0 && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="35" height="35">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <path d="M9 14h6" />
                      <path d="M12 17v-6" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="35" height="35">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h2>{item.value}</h2>
                  <p>{item.name}</p>
                </div>
                <p>{item.description}</p>
              </article>
            ))}
          </section>
        </div>

        {/* ----- Gallery of association ---- */}
        <section className={styles.gallery}>
          <h1>Gallery</h1>
          <div className={styles.content}>
            <article><img src={centre} alt="" /></article>
            <article><img src={children} alt="" /></article>
            <article><img src={energy} alt="" /></article>
            <article><img src={nature} alt="" /></article>
            <article><img src={science} alt="" /></article>
          </div>
        </section>

        <div className={styles.partenaires}>
          <h2>{t('partners.title')}</h2>
          <div className={styles.slide}>
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
                  <img src={p.image ? `${BASE_BACK_END_URL}${p.image}` : defaultPartner} alt={p.name} title={p.name} />
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
      <div className={styles.carouselCard}>
        {/* Set draggable to false to prevent default browser image ghost dragging */}
        <img src={`${BASE_BACK_END_URL}${item.photo}`} alt={item.nom} draggable="false" />
      </div>

      <div className={styles.cardFooter}>
        <h3>{item.nom} - <span className={styles.poste}>{item.poste}</span></h3>
        <p>{item.description.slice(0, 200)}</p>
      </div>
    </div>
  );
};

export default About;