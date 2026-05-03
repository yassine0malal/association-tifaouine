// ConfirmPopup.jsx
import styles from "./ConfirmPopup.module.css";

const VARIANTS = {
  danger: {
    iconBg: "#FCEBEB", iconColor: "#E24B4A",
    btnClass: styles.btnDanger,
    icon: (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
      </svg>
    ),
  },
  success: {
    iconBg: "#EAF3DE", iconColor: "#639922",
    btnClass: styles.btnSuccess,
    icon: (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  warning: {
    iconBg: "#FAEEDA", iconColor: "#BA7517",
    btnClass: styles.btnWarning,
    icon: (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  info: {
    iconBg: "#E6F1FB", iconColor: "#378ADD",
    btnClass: styles.btnInfo,
    icon: (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
  },
};

export default function Info({
  isOpen,
  onClose,
  onConfirm,
  variant = "danger",       // "danger" | "success" | "warning" | "info"
  title = "Confirmer l'action ?",
  description = "Cette action ne peut pas être annulée.",
  detailLabel = "",
  detailValue = "",
  cancelLabel = "Annuler",
  confirmLabel = "Confirmer",
}) {
  if (!isOpen) return null;

  const v = VARIANTS[variant];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>

        {/* Icône */}
        <div className={styles.iconZone}>
          <div className={styles.iconCircle} style={{ background: v.iconBg }}>
            {v.icon(v.iconColor)}
          </div>
        </div>

        {/* Texte */}
        <div className={styles.body}>
          <p className={styles.title}>{title}</p>
          <p className={styles.desc}>{description}</p>
        </div>

        {/* Détail optionnel */}
        {detailLabel && (
          <div className={styles.detail}>
            <span className={styles.detailLabel}>{detailLabel}</span>
            <span className={styles.detailValue}>{detailValue}</span>
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button className={`${styles.btn} ${v.btnClass}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}