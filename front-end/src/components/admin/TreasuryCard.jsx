import React from 'react';
import styles from './TreasuryCard.module.css';
import { useNavigate } from 'react-router-dom';

const formatMoney = (value) => {
    if (!value && value !== 0) return '—';
    const num = parseFloat(value);
    return num.toLocaleString('fr-MA', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};
export default function TreasuryCard({ totalDons, totalBudget, totalBeneficiaires, loading }) {
    const navigate =useNavigate()
    return (
        <div className={styles.treasuryCard}>
            <i className={`fa-solid fa-vault ${styles.bgIcon}`}></i>

            <div className={styles.cardContent}>
                <h3 className={styles.title}>Fonds de l'Association</h3>

                <div className={styles.balances}>
                    <div className={styles.mainBalance}>
                        <span className={styles.amount}>
                            {loading ? '…' : formatMoney(totalBudget ?? 0)}
                        </span>
                        <span className={styles.currency}>MAD</span>
                        <span className={styles.label}>Total des Dons</span>
                    </div>

                    {/* <div className={styles.secondaryBalance}>
                        <span className={styles.subAmount}>
                            {loading ? '…' : formatMoney(totalBudget ?? 0)}
                        </span>
                        <span className={styles.subLabel}>Budget total des projets</span>
                    </div> */}

                    <div className={styles.secondaryBalance}>
                        <span className={styles.subAmount}>
                            {loading ? '…' : (totalBeneficiaires ?? 0).toLocaleString('fr-MA')}
                        </span>
                        <span className={styles.subLabel}>Nombre de bénéficiaires</span>
                    </div>
                </div>

                <button className={styles.actionButton} onClick={()=>navigate("/admin/dons")}>
                    Gérer les fonds
                </button>
            </div>
        </div>
    );
}