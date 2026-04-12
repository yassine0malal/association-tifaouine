import { Link } from "react-router-dom";
import styles from "./event-card.module.css";

function EventCard( { id , title , img , date , domain } ) {
  return (
    <Link to={`/evenement/${id}`} className={styles.eventCard}>
      <div style={{ backgroundImage: `url(${img})`}} className={styles.cardBody}>
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