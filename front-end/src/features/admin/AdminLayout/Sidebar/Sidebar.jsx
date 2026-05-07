// Sidebar.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../Login/authSlice";
import {
  DashboardIcon, ProjectsIcon,
  DonsIcon, BenevolesIcon,
  SettingsIcon, LogoutIcon, ChevronIcon
} from "./icons";

import logo from "../../../../assets/images/logo.png"


const Sidebar = ({ isOpen, closeSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openMenus, setOpenMenus] = useState({
    contenu: false,
    financiere: false,
    communaute: false,
  });

  const toggle = (key) =>
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate("/adminLogin", { replace: true });
  };


  const isContenuActive = location.pathname.startsWith("/admin/projets")
    || location.pathname.startsWith("/admin/evenements")
    || location.pathname.startsWith("/admin/domaines")
    || location.pathname.startsWith("/admin/partenaires")
    || location.pathname.startsWith("/admin/ressources");

  const isFinanciereActive = location.pathname.startsWith("/admin/dons");

  const isCommunauteActive = location.pathname.startsWith("/admin/benevoles")
    || location.pathname.startsWith("/admin/membres")
    || location.pathname.startsWith("/admin/notifications")
    || location.pathname.startsWith("/admin/messages")
    || location.pathname.startsWith("/admin/subscription");

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.showSidebar : ""}`}>



      <div className={styles.topPart}>
        <div className={styles.logo} onClick={()=>navigate('/admin')}>
          <img src={logo} alt="" />
        </div>

        {/* MENU */}
        <p className={styles.sectionLabel}>MENU</p>
        <div className={styles.nav}>

          {/* Dashboard */}
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <DashboardIcon /> Dashboard
          </NavLink>

          {/* Gestion de Contenu */}
          <button
            className={`${styles.groupBtn} ${openMenus.contenu ? styles.groupOpen : ""}`}
            onClick={() => toggle("contenu")}
          >
            <span className={styles.groupLeft}><ProjectsIcon /> Gestion de Contenu</span>
            <ChevronIcon open={openMenus.contenu} />
          </button>
          {openMenus.contenu && (
            <div className={styles.subLinks}>
              <NavLink to="/admin/projets" className={({ isActive }) => isActive ? `${styles.subLink} ${styles.active}` : styles.subLink}>Projets</NavLink>
              <NavLink to="/admin/evenements" className={({ isActive }) => isActive ? `${styles.subLink} ${styles.active}` : styles.subLink}>Événements</NavLink>
              <NavLink to="/admin/domaines" className={({ isActive }) => isActive ? `${styles.subLink} ${styles.active}` : styles.subLink}>Domaines</NavLink>
              <NavLink to="/admin/partenaires" className={({ isActive }) => isActive ? `${styles.subLink} ${styles.active}` : styles.subLink}>Partenaires</NavLink>
              <NavLink to="/admin/ressources" className={({ isActive }) => isActive ? `${styles.subLink} ${styles.active}` : styles.subLink}>Ressources</NavLink>
            </div>
          )}

          {/* Financière */}
          <button
            className={`${styles.groupBtn} ${openMenus.financiere ? styles.groupOpen : ""}`}
            onClick={() => toggle("financiere")}
          >
            <span className={styles.groupLeft}><DonsIcon /> Financière</span>
            <ChevronIcon open={openMenus.financiere} />
          </button>
          {openMenus.financiere && (
            <div className={styles.subLinks}>
              <NavLink to="/admin/dons" className={({ isActive }) => isActive ? `${styles.subLink} ${styles.active}` : styles.subLink}>Dons</NavLink>
            </div>
          )}

          {/* Communauté */}
          <button
            className={`${styles.groupBtn} ${openMenus.communaute ? styles.groupOpen : ""}`}
            onClick={() => toggle("communaute")}
          >
            <span className={styles.groupLeft}><BenevolesIcon /> Communauté</span>
            <ChevronIcon open={openMenus.communaute} />
          </button>
          {openMenus.communaute && (
            <div className={styles.subLinks}>
              <NavLink to="/admin/benevoles" className={({ isActive }) => isActive ? `${styles.subLink} ${styles.active}` : styles.subLink}>Bénévoles</NavLink>
              <NavLink to="/admin/membres" className={({ isActive }) => isActive ? `${styles.subLink} ${styles.active}` : styles.subLink}>Membres</NavLink>
              <NavLink to="/admin/notifications" className={({ isActive }) => isActive ? `${styles.subLink} ${styles.active}` : styles.subLink}>Notifications</NavLink>
              <NavLink to="/admin/messages" className={({ isActive }) => isActive ? `${styles.subLink} ${styles.active}` : styles.subLink}>Contact</NavLink>
              <NavLink to="/admin/subscription" className={({ isActive }) => isActive ? `${styles.subLink} ${styles.active}` : styles.subLink}>Abonnés</NavLink>
            </div>
          )}
        </div>
      </div>





      {/* GENERAL */}
      <div className={styles.bottomPart}>
        <p className={styles.sectionLabel}>GENERAL</p>
        <div className={styles.nav}>
          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <SettingsIcon /> Paramètres
          </NavLink>

          <button className={`${styles.link} ${styles.logoutBtn}`} onClick={handleLogout}>
            <LogoutIcon /> Logout
          </button>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;