import { Link } from "react-router-dom";
import styles from "./event-card.module.css";
import { useTranslation } from "react-i18next";

const BACKEND_URL = import.meta.env.VITE_BASE_BACK_END_URL

function EventCard( { id ,title , img , date , domain } ) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  return (
    <Link to={`/${currentLang}/evenements/${id}`} className={styles.eventCard}>
      <div style={{ backgroundImage: `url(${BACKEND_URL}${img})`}} className={styles.cardBody}>
        <div className={styles.content}>
            <div className={styles.meta}>
                <span className={styles.domain}>{domain}</span>
                <span className={styles.date}>{date}</span>
            </div>

            <h3 className={styles.title}>
                {title}
            </h3>
        </div>
      </div>
    </Link>
  );
}



export default EventCard;