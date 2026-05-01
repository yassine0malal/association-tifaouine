import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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