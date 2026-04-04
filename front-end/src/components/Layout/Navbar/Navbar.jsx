import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Links from "./Links";
import {Link} from "react-router-dom"
import Aside from './Aside'

import styles from "./Navbar.module.css";

import menu from "../../../assets/icons/menu.png";
import tel from "../../../assets/icons/call.png";
import email from "../../../assets/icons/email.png";
import map from "../../../assets/icons/map.png";
import logo from "../../../assets/images/logo.png";


export default function NavBar() {
    const navigate = useNavigate();
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
                    <select name="lang" id="">
                        <option value="fr">Fr</option>
                        <option value="ar">Ar</option>
                    </select>
                </div>


            </div>

            <div className={styles.navBarSection}>

                <div>
                    <img src={logo} width="160px"/>
                </div>

                 {/* The Nabbar of the phone  */}
                <div className={styles.link1}>
                    <img src={menu} alt="menu" />
                    <Aside/>
                </div>

                <div className={styles.link2}>
                    <Links />
                </div>
            </div>
        </>
    );
}