import React, { useRef, useEffect, useState } from 'react';
import { 
  motion, 
  useMotionValue, 
  useAnimationFrame 
} from 'framer-motion';

// Import CSS Module
import styles from './About.module.css';

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
    <div className={styles.AboutSection}>
      
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