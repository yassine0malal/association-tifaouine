import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import styles from './Navbar.module.css';

import { fetchDomains } from "../../../features/domains/domainsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
export default function Links() {
    const { t } = useTranslation("nav");
    const dispatch = useDispatch()
    const { data, status } = useSelector((state) => state.domains);

    useEffect(() => {
        if ( status=== "idle") {
            dispatch(fetchDomains());
        }
    }, [status, dispatch])

    if (status == "pending") return <h2>Loading Domains...</h2>
    const menuData = [
        {
            id: "a-propos",
            title: t("nav.about"),
            to: null, // pas de lien direct
            subItems: [
                { label: t("nav.dropdown.about.us"), path: "/about/nous" },
                { label: t("nav.dropdown.about.contact"), path: "/about/contact" }
            ]
        },
        {
            id: "activites",
            title: t("nav.activities"),
            to: null,
            subItems: [
                { label: t("nav.dropdown.activities.projects"), path: "/activites/projets" },
                { label: t("nav.dropdown.activities.events"), path: "/activites/evenements" },
            ]
        },
        {
            id: "participez",
            title: t("nav.getInvolved"),
            to: null,
            subItems: [
                { label: t("nav.dropdown.getInvolved.donate"), path: "/partisipez/Faire-un-don" },
                { label: t("nav.dropdown.getInvolved.becomeMember"), path: "/partisipez/Devenir-membre" }
            ]
        },
        {
            id: "domaines",
            title: t("nav.domains"),
            to: "/about",
            subItems: (data?.map((domain) => ({
                label: domain.label,
                path: `/activites/${domain.id}`
            })))
            
        },
        {
            id: "ressources",
            title: t("nav.resources"),
            to: null,
            subItems: [
                { label: t("nav.dropdown.resources.reports"), path: "/ressources/rapports" },
                { label: t("nav.dropdown.resources.partners"), path: "/ressources/partenaires" }
            ]
        }
    ];

    return (
        <nav>
            <ul>
                {menuData.map((item) => (
                    <li key={item.id} className={`${styles.navItem} ${styles.hasDropDown}`}>
                        <Link >{item.title}</Link>
                        <ul className={styles.dropdownMenu}>
                            {item.subItems?.map((subItem) => (
                                <li key={subItem.path}>
                                    <Link to={subItem.path}>{subItem.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </nav>
    );
}