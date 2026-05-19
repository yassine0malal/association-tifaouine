import styles from './event-card-skeleton.module.css';

const SkeletonEventCard = () => {
  return (
    <div className={styles.skeletonEventCard}>
      <div className={styles.skeletonCardBody}>
        <div className={styles.skeletonContent}>
          <div className={styles.skeletonMeta}>
            <span className={styles.skeletonDomain}></span>
            <span className={styles.skeletonDate}></span>
          </div>
          <div className={styles.skeletonTitle}>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonEventCard;