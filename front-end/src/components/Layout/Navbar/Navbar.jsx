import { useState } from "react";
import Links from "./Links";
import { Link, useLocation } from "react-router-dom";
import Aside from "./Aside";

import styles from "./Navbar.module.css";

import menu from "../../../assets/icons/menu.png";
import tel from "../../../assets/icons/call.png";
import email from "../../../assets/icons/email.png";
import map from "../../../assets/icons/map.png";
import logo from "../../../assets/images/logo.png";
import { useTranslation } from "react-i18next";
import { FaBarsStaggered } from "react-icons/fa6";

const DOMAIN_NAME = "http://localhost:5173"

export default function NavBar() {
  const { i18n, t } = useTranslation("nav");
  const currentLang = i18n.resolvedLanguage;
  const [showAside, setShowAside] = useState(false);
  const currentUrl = window.location.href;
  function changeLanguage(lang) {
    i18n.changeLanguage(lang);
  }

  const { pathname } = useLocation();
  const isHome = /^\/[a-z]{2}$/.test(pathname);

  return (
    <>
      <div className={styles.upperNavbar}>
        <div className={styles.container}>
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
            <button
              className={currentLang == "fr" ? "isActive" : ""}
              onClick={() => changeLanguage("fr")}
            >
              {" "}
              Français{" "}
            </button>
            <span>|</span>
            <button
              className={currentLang == "en" ? "isActive" : ""}
              onClick={() => changeLanguage("en")}
            >
              English
            </button>
            <span>|</span>
            <button
              className={currentLang == "ar" ? "isActive" : ""}
              onClick={() => changeLanguage("ar")}
            >
              العربية
            </button>
          </div>
        </div>
      </div>

      <div className={styles.navBarSection}>
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <Link to="/">
              <img src={logo} width="160px" />
            </Link>
          </div>

          <div className={`${styles.link2} ${showAside ? styles.open : ""}`}>
            <Links setShowAside={setShowAside}/>
          </div>

          <div className={styles.navBtns}>
            <Link
              className={styles.participateBtn}
              to={`/${currentLang}/join-us`}
            >
              {t("nav.participate")}
            </Link>

            <div className={styles.sideBarMenuIcon} onClick={() => setShowAside(true)}>
              <FaBarsStaggered />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

