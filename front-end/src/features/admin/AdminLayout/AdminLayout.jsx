import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import styles from "./AdminLayout.module.css";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== 'fr') {
      i18n.changeLanguage('fr');
    }
  }, [i18n]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.adminContainer}>
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      
      <div className={styles.mainArea}>
        <Header onMenuClick={toggleSidebar} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      {isSidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar}></div>
      )}
    </div>
  );
}