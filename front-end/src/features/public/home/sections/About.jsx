import styles from './about.module.css';

const stats = [
  { value: '10,000', suffix: '+', label: 'Happy Travelers' },
  { value: '50', suffix: '+', label: 'Destinations' },
  { value: '98', suffix: '%', label: 'Satisfaction Rate' },
  { value: '15', suffix: '+', label: 'Years Experience' },
];

export default function AboutUs() {
  return (
    <section className={styles.section}>
      {/* Decorative background blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.container}>
        {/* ── LEFT COLUMN ── */}
        <div className={styles.content}>
          <span className={styles.eyebrow}>Who We Are</span>
          <h2 className={styles.heading}>About Us</h2>

          <p className={styles.body}>
            At <strong>Flygo</strong>, we believe travel is more than reaching a
            destination — it's about the moments you collect along the way.
            Whether you're seeking adventure, relaxation, or cultural immersion,
            we design journeys around what truly matters to you.
          </p>
          <p className={styles.body}>
            With expert planning, trusted global partners, and a passion for
            exploration, we make travel effortless, inspiring, and unforgettable.
          </p>

          <a href="#more" className={styles.cta}>
            More about
            <span className={styles.ctaArrow}>→</span>
          </a>
        </div>

        {/* ── RIGHT COLUMN — stacked photos ── */}
        <div className={styles.imagery}>
          <div className={styles.cardBack}>
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80"
              alt="Mountain lake"
              className={styles.cardImg}
            />
          </div>
          <div className={styles.cardFront}>
            <img
              src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80"
              alt="Desert traveler"
              className={styles.cardImg}
            />
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className={styles.statsBar}>
        {stats.map(({ value, suffix, label }) => (
          <div key={label} className={styles.statItem}>
            <div className={styles.statNumber}>
              {value}
              <span className={styles.statSuffix}>{suffix}</span>
            </div>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}