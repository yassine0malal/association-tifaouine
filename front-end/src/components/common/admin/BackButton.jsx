// src/components/common/BackButton.jsx
import { useNavigate } from "react-router-dom";
import styles from "./BackButton.module.css";

export default function BackButton({ to, label = "Retour" }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button className={styles.backBtn} onClick={handleBack} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            {label}
        </button>
    );
}