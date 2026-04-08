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
// Import CSS Module
import styles from './About.module.css';
import PageHero from '../../components/common/PageHero';
import Btn from '../../components/common/Button';

const teamData = [
  { id: 1, src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80", title: "Real-Time Collaboration", desc: "Communicate seamlessly and keep everyone in sync." },
  { id: 2, src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80", title: "Task & Project Tracking", desc: "Assign tasks, set deadlines, and visualize progress." },
  { id: 3, src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80", title: "Performance Insights", desc: "Make smarter decisions with real-time analytics." },
  { id: 4, src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80", title: "Real-Time Collaboration", desc: "Communicate seamlessly and keep everyone in sync." },
  { id: 5, src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80", title: "Task & Project Tracking", desc: "Assign tasks, set deadlines, and visualize progress." },
  { id: 6, src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80", title: "Performance Insights", desc: "Make smarter decisions with real-time analytics." },
];

const infiniteData = [...teamData, ...teamData];

const About = () => {
  const [trackWidth, setTrackWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const x = useMotionValue(0);

  useEffect(() => {
    const updateWidth = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth / 2);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useAnimationFrame((t, delta) => {
    if (isPaused || trackWidth === 0) return;

    let moveBy = -0.05 * delta;
    let newX = x.get() + moveBy;

    if (newX <= -trackWidth) {
      newX += trackWidth;
    } else if (newX > 0) {
      newX -= trackWidth;
    }

    x.set(newX);
  });

  return (
    <>
      <PageHero title={"À propos de nous "} heroImg={HeroBg} />
      <div className={styles.AboutSection}>

        <div className={styles.associationDescription}>

          <div className={styles.imageWrapper}>
            <img src={association} alt="tifaouine" />
          </div>
          <div className={styles.description}>
            <p>Qui sommes nous ?</p>
            <h2>Tifaouine, c’est la clarté de l’espoir pour éclairer le chemin des plus démunis.</h2>
            <p>
              Depuis sa création le 6 août 1998 à Asni, l’association Tifaouine s'engage pour le développement social et rural dans la province d'Al Haouz. Notre mission est d'offrir un accompagnement global aux populations locales à travers le désenclavement, l'accès à l'éducation et le soutien à l'agriculture durable .
              À travers nos projets et formations, nos équipes travaillent chaque jour pour restaurer les droits fondamentaux des citoyens et leur permettre de construire un avenir digne au cœur de leurs montagnes.
            </p>

            <div className={styles.options}>
              <div className={styles.optionWarper}>
                <img src={checked} alt="task" />
                <p><b>Désenclaver</b> en aménageant des pistes rurales et en facilitant l'accès à l'eau potable .</p>
              </div>
              <div className={styles.optionWarper}>
                <img src={checked} alt="task" />
                <p><b>Éduquer</b> et former à travers la lutte contre l'analphabétisme, le soutien scolaire et la formation technique des agriculteurs .</p>
              </div>
              <div className={styles.optionWarper}>
                <img src={checked} alt="task" />
                <p><b>Promouvoir</b> l'autonomie en accompagnant les femmes et les paysans vers des projets de développement durable et économique .</p>
              </div>

              <div className={styles.interaction}>
                <div className={styles.button}>
                  <Btn title={"FAIRE UN DON"} />
                </div>
                <div className={styles.phone}>
                  <img src={call} alt="" />
                  <p>+212 522 75 69 65</p>
                </div>
              </div>


            </div>

          </div>
        </div>

        <div className={styles.hashtage}>
          <h3>Depuis plus de 30 ans, notre engagement se traduit par des actions concrètes au service des communautés au Al Haouz-Maroc.</h3>

          <p>Équipement du siège de l’association # Autonomisation des femmes (couture, tissage, artisanat) # Lutte contre l’analphabétisme # Formations en gestion administrative et financière # Formation des agriculteurs
             (apiculture, agriculture biologique, élevage) # Plantation et distribution d’arbres fruitiers # Protection de l’environnement et lutte contre l’érosion # Ouverture de pistes rurales pour désenclaver 
             les villages # Accès à l’eau potable et assainissement # Construction d’infrastructures sociales # Création de centres de formation et clubs féminins # Soutien à l’éducation préscolaire et aux enfants 
             # Réalisation d’un hammam public # Développement d’activités génératrices de revenus # Campagnes de sensibilisation sanitaire et environnementale # Accueil de délégations nationales et internationales # Accompagnement des agriculteurs # Soutien aux établissements scolaires</p>
        </div>


        {/* Carousel Card */}
        <div className={styles.carouselWrapper}>
          <motion.div
            ref={trackRef}
            className={styles.carouselTrack}
            drag="x"
            style={{ x }}
            onDragStart={() => setIsPaused(true)}
            onDragEnd={() => setIsPaused(false)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {infiniteData.map((item, index) => (
              <CarouselCard key={index} item={item} styles={styles} />
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

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