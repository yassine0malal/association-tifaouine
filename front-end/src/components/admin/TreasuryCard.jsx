import React from 'react';
import styles from './TreasuryCard.module.css';

export default function TreasuryCard() {
  return (
    <div className={styles.treasuryCard}>
      {/* The subtle background icon (replacing the calculator) */}
      <i className={`fa-solid fa-vault ${styles.bgIcon}`}></i>

      <div className={styles.cardContent}>
        <h3 className={styles.title}>Fonds de l'Association</h3>
        
        <div className={styles.balances}>
          <div className={styles.mainBalance}>
            <span className={styles.amount}>85,000.00</span>
            <span className={styles.currency}>MAD</span>
            <span className={styles.label}>Fonds Disponibles</span>
          </div>

          <div className={styles.secondaryBalance}>
             <span className={styles.subAmount}>8,541.67</span>
             <span className={styles.subLabel}>Alloués aux projets</span>
          </div>
        </div>

        <button className={styles.actionButton}>
          Gérer les fonds
        </button>
      </div>
    </div>
  );
}