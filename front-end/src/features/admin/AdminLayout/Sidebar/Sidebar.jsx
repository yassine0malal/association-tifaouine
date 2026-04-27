// src/components/admin/Sidebar.jsx
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const links = [
    { to: "/admin", label: "Dashboard", icon: "📊" },
    { to: "/admin/projets", label: "Projets", icon: "📁" },
    { to: "/admin/evenements", label: "Événements", icon: "📅" },
    { to: "/admin/ressources", label: "Ressources", icon: "📄" },
    { to: "/admin/partenaires", label: "Partenaires", icon: "🤝" },
    { to: "/admin/domaines", label: "Domaines", icon: "🌍" },
  ];

  return (
    <div className={styles.adminSidebar}>
      <div className={styles.logo}>Tifaouine Admin</div>
      <div className={styles.adminNab}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;