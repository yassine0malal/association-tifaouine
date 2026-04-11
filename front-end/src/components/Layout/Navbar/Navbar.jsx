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
import i18n from "i18next";
import { useTranslation } from "react-i18next";

function changeLanguage(lang){
    i18n.changeLanguage(lang);
}

export default function NavBar() {
    const { i18n } = useTranslation();
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
                    <button onClick={() => changeLanguage("fr")}>FR</button>
                    <button onClick={() => changeLanguage("ar")}>AR</button>
                    <button onClick={() => changeLanguage("en")}>EN</button>
                </div>


            </div>

            <div className={styles.navBarSection}>

                <div>
                    <Link to="/"><img src={logo} width="160px" /></Link>
                </div>

                {/* The Nabbar of the phone  */}
                <div className={styles.link1}>
                    <img src={menu} alt="menu" />
                    <Aside />
                </div>

                <div className={styles.link2}>
                    <Links />
                </div>
            </div>
        </>
    );
}