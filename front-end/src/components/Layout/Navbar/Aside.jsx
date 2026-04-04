import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import plus from "../../../assets/icons/plus.png";
import minus from "../../../assets/icons/minus.png";
import { useState } from "react";
export default function Aside() {

    const [openMenu, setOpenMenu] = useState(null);

    const handleToggle = (id) => {
        //track witch one is open
        setOpenMenu(openMenu === id ? null : id);
    }

    const menuData = [
        {
            id: "a-propos",
            title: "À propos",
            subItems: [
                { label: "Nous", path: "/about/nous" },
                { label: "Contact", path: "/about/contact" }
            ]
        },
        {
            id: "activites",
            title: "Activités",
            subItems: [
                { label: "Projets", path: "/activites/projets" },
                { label: "Événements", path: "/activites/evenements" },
                { label: "Actualités", path: "/activites/actualites" }
            ]
        },
        {
            id: "participez",
            title: "Participez",
            subItems: [
                { label: "Faire un don", path: "/participez/don" },
                { label: "Devenir membre", path: "/participez/membre" }
            ]
        },
        {
            id: "domaines",
            title: "Domaines",
            subItems: [
                { label: "Education", path: "/domaines/education" },
                { label: "Eau", path: "/domaines/eau" },
                { label: "Agriculture", path: "/domaines/agriculture" }
            ]
        },
        {
            id: "ressources",
            title: "Ressources",
            subItems: [
                { label: "Rapport", path: "/ressources/rapport" },
                { label: "Partenaires", path: "/ressources/partenaires" }
            ]
        }
    ];


    return (
        <aside>
            {
                menuData.map((item) => (
                    <div key={item.id} className={`${styles.asideItem} ${styles.hasDropDownAside}`}>
                        <button onClick={() => handleToggle(item.id)}>
                            <span>{item.title} </span>  <img src={openMenu == item.id ? minus : plus} alt="toggle" />
                        </button>

                        {

                            <div className={`${styles.submenuWrapper} ${item.id == openMenu ? styles.isOpen : ""}`}>
                                <ul className={`${styles.dropdownMenuAside} `}>
                                    {
                                        item.subItems.map((subItem) => (
                                            <li key={subItem.label} >
                                                <Link to={subItem.path}>{subItem.label}</Link>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>

                        }
                    </div>
                ))
            }


        </aside>
    );
}