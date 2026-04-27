// src/components/admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  return (
    <div className={styles.adminContainer}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>
          <Outlet />   {/* admin pages appear here */}
        </main>
      </div>
    </div>
  );
}