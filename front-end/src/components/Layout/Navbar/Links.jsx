import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import styles from './Navbar.module.css';

import { fetchDomains } from "../../../features/domains/domainsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import i18n from "../../../i18n";
import Loader from "../../common/Loader";


export default function Links() {
    const { t } = useTranslation("nav");
    const dispatch = useDispatch()
    const { data: domains, status } = useSelector((state) => state.domains);


    useEffect(() => {
        const lang = i18n.resolvedLanguage || "fr";
        dispatch(fetchDomains(lang));
    }, [dispatch, i18n.language]);


    if (status == "pending") return <Loader/>
    const menuData = [
        {
            id: "a-propos",
            title: t("nav.about"),
            to: null,
            subItems: [
                { label: t("nav.dropdown.about.us"), path: `/${i18n.language}/nous` },
                { label: t("nav.dropdown.about.contact"), path: `/${i18n.language}/contact` }
            ]
        },
        {
            id: "activites",
            title: t("nav.activities"),
            to: null,
            subItems: [
                { label: t("nav.dropdown.activities.projects"), path: `/${i18n.language}/projets` },
                { label: t("nav.dropdown.activities.events"), path: `/${i18n.language}/evenements` },
            ]
        },
        {
            id: "participez",
            title: t("nav.getInvolved"),
            to: `/${i18n.language}/join-us`,
            subItems: [
                { label: t("nav.dropdown.getInvolved.donate"), path: `/${i18n.language}/Faire-un-don` },
                { label: t("nav.dropdown.getInvolved.becomeMember"), path: `/${i18n.language}/join-us/member` },
                { label: t("nav.dropdown.getInvolved.becomeVolunteer"), path: `/${i18n.language}/join-us/volunteer` }
            ]
        },
        {
            id: "domaines",
            title: t("nav.domains"),
            to: `${i18n.language}/domains`,
            subItems: domains?.length
                ? domains.map((domain) => ({
                    label: domain.label,
                    path: `/${i18n.language}/domains/${domain.id}`
                }))
                : []

        },
        {
            id: "ressources",
            title: t("nav.resources"),
            to: null,
            subItems: [
                { label: t("nav.dropdown.resources.reports"), path: `/${i18n.language}/rapports` },
                { label: t("nav.dropdown.resources.partners"), path: `/${i18n.language}/partenaires` }
            ]
        }
    ];

    return (
        <nav>
            <ul>
                {menuData.map((item) => (
                    <li key={item.id} className={`${styles.navItem} ${styles.hasDropDown}`}>
                        <Link to={item.to}><span>{item.title} </span></Link>
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