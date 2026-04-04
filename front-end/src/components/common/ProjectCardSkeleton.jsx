import styles from "./projectCardSkeleton.module.css";

export default function ProjectCardskeleton() {
  return (
    <div className={styles.cardSkeleton}>
      <div className={`${styles.image} ${styles.skeleton}`}></div>

      <div className={styles.content}>
        <div>
          <span className={`${styles.state} ${styles.skeleton}`}></span>
          <span className={`${styles.date} ${styles.skeleton}`}></span>
        </div>

        <div className={`${styles.title} ${styles.skeleton}`}></div>

        <div className={styles.description}>
          <span className={`${styles.skeleton}`}></span>
          <span className={`${styles.skeleton}`}></span>
        </div>

        <button className={`${styles.skeleton}`}></button>
      </div>
    </div>
  );
}
