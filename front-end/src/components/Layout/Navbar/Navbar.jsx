import { useState } from "react";
import Links from "./Links";
import { Link } from "react-router-dom"
import Aside from './Aside'

import styles from "./Navbar.module.css";

import menu from "../../../assets/icons/menu.png";
import tel from "../../../assets/icons/call.png";
import email from "../../../assets/icons/email.png";
import map from "../../../assets/icons/map.png";
import logo from "../../../assets/images/logo.png";
import { useTranslation } from "react-i18next";


export default function NavBar() {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;
    const [showAside, setShowAside] = useState(false);



    const handleShowAside = () => {
        setShowAside(!showAside);
    }
    function changeLanguage(lang) {
        i18n.changeLanguage(lang);
    }


    return (
        <>
            <div className={styles.upperNavbar}>
                <div className={styles.content}>
                    <div className={styles.item}>
                        <img src={email} alt="email" />
                        <p>tifaouine@gmail.com</p>
                    </div>
                    <div className={styles.item}>
                        <img src={tel} alt="telephone" />
                        <p>066 01 46 48</p>
                    </div>
                    <div className={styles.item}>
                        <img src={map} alt="map" />
                        <p> douar asni lakdim 42150, Marrakech Al Haouz - Maroc </p>

                    </div>
                </div>

                <div className={styles.language}>
                    <button className={currentLang == "fr" ? "isActive" : ""} onClick={() => changeLanguage("fr")}> Français                                                                                                                                                                            </button>
                    <span>|</span>
                    <button className={currentLang == "en" ? "isActive" : ""} onClick={() => changeLanguage("en")}>English</button>
                    <span>|</span>
                    <button className={currentLang == "ar" ? "isActive" : ""} onClick={() => changeLanguage("ar")}>العربية</button>
                </div>


            </div>
                            
            <div className={styles.navBarSection}>

                <div>
                    <Link to="/"><img src={logo} width="160px" /></Link>
                </div>

                {/* The Nabbar of the phone  */}
                <div className={styles.link1}>
                    <div className={styles.imageContainer}>
                        <img onClick={() => { handleShowAside() }} src={menu} alt="menu" />
                    </div>
                    {showAside == true ? <Aside /> : ""}
                </div>

                <div className={styles.link2}>
                    <Links />
                </div>
            </div>
        </>
    );
}