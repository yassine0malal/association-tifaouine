import styles from "./footer.module.css";
import sendIcon from "../../../assets/icons/send.png"
import facebook from "../../../assets/icons/facebook.png";
import instagram from "../../../assets/icons/instagram.png";
import linkedin from "../../../assets/icons/linkedin.png";
import x from "../../../assets/icons/x.png";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <div className={styles.warper}>
            <div className={styles.footerSection}>

                <div className={styles.company}>
                    <h1>Tifaouine</h1>

                    <p>Tifaouine Foundation est une association marocaine,<br /> basée à El House.</p>
                    <div className={styles.send}>
                        <input type="text" placeholder="Entrer votre email" />
                        <img src={sendIcon} alt="" />
                    </div>
                </div>

                <div className="support">
                    <h3>Support</h3>
                    <p> douar asni lakdim 42150, Marrakech Al Haouz – Maroc </p>
                    <p>support@Tifaouine.com</p>
                    <p>Tel /fax : 024 48 53 08</p>
                    <p>GSM président : 066 01 46 48</p>
                    <b>Compte bancaire :</b>
                    <p>Wafa banque :098 B 001872</p>
                    <p>  Crédit agricole : b906457X651</p>
                </div>

                <div className={styles.siteMap}>
                    <h3>Carte de Site</h3>
                    <nav>
                        <Link to="/home">À propos</Link>
                        <Link to="/promotions">Activités</Link>
                        <Link to="/best-sellers">Participez</Link>
                        <Link to="/about">Domaines</Link>
                        <Link to="/login">Ressources</Link>
                    </nav>
                </div>
                <div className={styles.socialNetwork}>
                    <h3>Réseaux Sociaux</h3>
                    <div className={styles.net}>
                        <a href=""><img src={facebook} alt="facebook" /></a>
                        <a href=""><img src={x} alt="twitter" /></a>
                        <a href=""><img src={instagram} alt="instagram" /></a>
                        <a href=""><img src={linkedin} alt="linkden" /></a>

                    </div>
                </div>
            </div>
            <hr />
            <div className={styles.copyrights}>
                <p>&copy; Copyright Tifaouine {new Date().getFullYear()}. All right reserved</p>
            </div>

        </div>
    );
}