import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import styles from './Navbar.module.css';

export default function Links() {
    const { t } = useTranslation("nav");

    return (
        <nav>
            <ul>
                <li className={`${styles.navItem} ${styles.hasDropDown}`}>
                    <Link>{t('nav.about')}</Link>
                    <ul className={styles.dropdownMenu}>
                        <li><Link to={'/about/nous'}>{t('nav.dropdown.about.us')}</Link></li>
                        <li><Link to={'/about/contact'}>{t('nav.dropdown.about.contact')}</Link></li>
                    </ul>
                </li>

                <li className={`${styles.navItem} ${styles.hasDropDown}`}>
                    <Link>{t('nav.activities')}</Link>
                    <ul className={styles.dropdownMenu}>
                        <li><Link to="/activites/projets">{t('nav.dropdown.activities.projects')}</Link></li>
                        <li><Link to="/activites/evenements">{t('nav.dropdown.activities.events')}</Link></li>
                        <li><Link to="/activites/actualites">{t('nav.dropdown.activities.news')}</Link></li>
                    </ul>
                </li>

                <li className={`${styles.navItem} ${styles.hasDropDown}`}>
                    <Link>{t('nav.getInvolved')}</Link>
                    <ul className={styles.dropdownMenu}>
                        <li><Link to="/partisipez/Faire-un-don">{t('nav.dropdown.getInvolved.donate')}</Link></li>
                        <li><Link to="/partisipez/Devenir-membre">{t('nav.dropdown.getInvolved.becomeMember')}</Link></li>
                    </ul>
                </li>

                <li className={`${styles.navItem} ${styles.hasDropDown}`}>
                    <Link to="/about">{t('nav.domains')}</Link>
                    <ul className={styles.dropdownMenu}>
                        <li><Link to="/activites/education">{t('nav.dropdown.domains.education')}</Link></li>
                        <li><Link to="/activites/eau">{t('nav.dropdown.domains.water')}</Link></li>
                        <li><Link to="/activites/agriculture">{t('nav.dropdown.domains.agriculture')}</Link></li>
                    </ul>
                </li>

                <li className={`${styles.navItem} ${styles.hasDropDown}`}>
                    <Link>{t('nav.resources')}</Link>
                    <ul className={styles.dropdownMenu}>
                        <li><Link to="/ressources/rapports">{t('nav.dropdown.resources.reports')}</Link></li>
                        <li><Link to="/ressources/partenaires">{t('nav.dropdown.resources.partners')}</Link></li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
}