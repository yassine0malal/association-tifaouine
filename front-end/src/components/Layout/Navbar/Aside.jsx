import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Navbar.module.css";
import plus from "../../../assets/icons/plus.png";
import minus from "../../../assets/icons/minus.png";
import { useState,useEffect } from "react";
import { useDispatch ,useSelector } from "react-redux";

export default function Aside() {
    const { t } = useTranslation("nav");
    const [openMenu, setOpenMenu] = useState(null);
    const dispatch = useDispatch()
    const { data, status } = useSelector((state) => state.domains);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchDomains());
        }
    }, [status, dispatch])

    const handleToggle = (id) => {
        setOpenMenu(openMenu === id ? null : id);
    };

    if (status == "pending") return <h2>Loading Domains...</h2>


    const menuData = [
        {
            id: "a-propos",
            title: t("nav.about"),
            subItems: [
                { label: t("nav.dropdown.about.us"), path: "/about/nous" },
                { label: t("nav.dropdown.about.contact"), path: "/about/contact" }
            ]
        },
        {
            id: "activites",
            title: t("nav.activities"),
            subItems: [
                { label: t("nav.dropdown.activities.projects"), path: "/activites/projets" },
                { label: t("nav.dropdown.activities.events"), path: "/activites/evenements" },
            ]
        },
        {
            id: "participez",
            title: t("nav.getInvolved"),
            subItems: [
                { label: t("nav.dropdown.getInvolved.donate"), path: "/participez/don" },
                { label: t("nav.dropdown.getInvolved.becomeMember"), path: "/participez/membre" }
            ]
        },
        {
            id: "domaines",
            title: t("nav.domains"),
            subItems: data?.map((domain) => ({
                label: domain.label,
                path: `/activites/${domain.id}`
            }))
        },
        {
            id: "ressources",
            title: t("nav.resources"),
            subItems: [
                { label: t("nav.dropdown.resources.reports"), path: "/ressources/rapports" },
                { label: t("nav.dropdown.resources.partners"), path: "/ressources/partenaires" }
            ]
        }
    ];

    return (
        <aside>
            {menuData.map((item) => (
                <div key={item.id} className={`${styles.asideItem} ${styles.hasDropDownAside}`}>
                    <button onClick={() => handleToggle(item.id)}>
                        <span>{item.title} </span>{" "}
                        <img src={openMenu === item.id ? minus : plus} alt="toggle" />
                    </button>

                    {
                        <div
                            className={`${styles.submenuWrapper} ${item.id === openMenu ? styles.isOpen : ""
                                }`}
                        >
                            <ul className={`${styles.dropdownMenuAside} `}>
                                {item.subItems?.map((subItem) => (
                                    <li key={subItem.label}>
                                        <Link to={subItem.path}>{subItem.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                </div>
            ))}
        </aside>
    );
}