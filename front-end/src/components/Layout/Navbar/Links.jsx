import { Link } from "react-router-dom";
import styles from './Navbar.module.css';

export default function Links() {
    return (
        <nav >
            <ul>

                <li className={`${styles.navItem} ${styles.hasDropDown}`}>
                    <Link >À propos</Link>
                    <ul className={styles.dropdownMenu}>
                        <li><Link to={'/about/nous'}>Nous</Link></li>
                        <li><Link to={'/about/contact'}>Contact</Link></li>
                    </ul>
                </li>

                <li className={`${styles.navItem} ${styles.hasDropDown}`}>
                    <Link >Activités</Link>
                    <ul className={styles.dropdownMenu}>
                        <li> <Link to="/activites/projets">Projets</Link></li>
                        <li> <Link to="/activites/evenements">Événement</Link></li>
                        <li> <Link to="/activites/actualites">Actualités</Link></li>
                    </ul>
                </li>

                <li className={`${styles.navItem} ${styles.hasDropDown}`}>
                    <Link>Participez</Link>
                    <ul className={styles.dropdownMenu}>
                        <li> <Link to="/partisipez/Faire-un-don">Faire un don</Link></li>
                        <li> <Link to="/partisipez/Devenir-membre">Devenir membre</Link></li>
                    </ul>
                </li>

                <li className={`${styles.navItem} ${styles.hasDropDown}`}>
                    <Link to="/about">Domaines</Link>
                    <ul className={styles.dropdownMenu}>
                        <li> <Link to="/activites/education">Education</Link></li>
                        <li> <Link to="/activites/eau">Eau</Link></li>
                        <li> <Link to="/activites/agriculture">Agriculture</Link></li>
                    </ul>
                </li>

                <li className={`${styles.navItem} ${styles.hasDropDown}`}>
                    <Link>Ressources</Link>
                    <ul className={styles.dropdownMenu}>
                        <li> <Link to="/ressources/rapports">Rapport</Link></li>
                        <li> <Link to="/ressources/partenaires">Partenaires</Link></li>
                    </ul>
                </li>

            </ul>
        </nav>
    );
}