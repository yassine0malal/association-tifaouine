import React from 'react';
import styles from './dashboard.module.css';
import TreasuryCard from '../../../components/admin/TreasuryCard';
import { ArrowUpRightIcon, CalendarIcon, MoneyIcon, NewsIcon } from '../AdminLayout/Sidebar/icons';

const AdminDashboard = () => {
  // Dummy data for the "Recent Requests" table
  const recentRequests = [
    { id: 1, user: "Username", role: "Member", status: "Approved", date: "2025-03-04" },
    { id: 2, user: "Username", role: "Benevol", status: "pending", date: "2025-03-05" },
    { id: 3, user: "Username", role: "Member", status: "rejected", date: "2022-03-05" },
    { id: 4, user: "Username", role: "benevol", status: "Approved", date: "2026-05-11" },
  ];
  const statsData = [
    {
      title: "Total Projets",
      value: 24,
      trend: "+ 5%",
      description: "Increased from last month",
      icon: "arrow-up-right",
      highlight: true
    },
    {
      title: "Total Evenments",
      value: 12,
      trend: "+ 3%",
      description: "Increased from last month",
      icon: "calendar"
    },
    {
      title: "Total Domains",
      value: 45,
      trend: "+ 3%",
      description: "Increased from last month",
      icon: "news"
    },
    {
      title: "Total dons",
      value: "4.43K DH",
      trend: "+ 8%",
      description: "Increased from last month",
      icon: "money"
    }
  ];

  const iconMap = {
    "arrow-up-right": <ArrowUpRightIcon />,
    "calendar": <CalendarIcon />,
    "news": <NewsIcon />,
    "money": <MoneyIcon />
  };
  return (
    <div className={styles.dashboardAdminPage}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1>Dashboard</h1>
          <p>Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.addProjectBtn}><span>+</span> Ajouter Projet</button>
          <button className={styles.addEventBtn}><span>+</span> Ajouter Evenement</button>
        </div>
      </header>

      {/* Stats Cards Grid */}
      <div className={styles.statsGrid}>
        {statsData.map((item, index) => (
          <div
            key={index}
            className={`${styles.statCard} ${item.highlight ? styles.goldCard : ""
              }`}
          >
            <div className={styles.cardHeader}>
              <span>{item.title}</span>
              <div className={styles.iconCircle}>
                {/* <div className={item.icon}> */}
                {iconMap[item.icon]}
                {/* </div> */}
              </div>
            </div>

            <div className={styles.cardValue}>{item.value}</div>
            <div className={styles.footerCard}>

              <div className={styles.cardTrend}>
                <span className={styles.trend}>{item.trend}</span> {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Requests and Activity */}
      <div className={styles.mainContent}>
        <section className={styles.tableSection}>
          <div className={styles.sectionHeader}>
            <h2>Recent Requests</h2>
            <button className={styles.showMore}><span>Show More</span> &gt;</button>
          </div>
          <table className={styles.requestsTable}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req) => (
                <tr key={req.id}>
                  <td>{req.user}</td>
                  <td>{req.role}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[req.status.toLowerCase()]}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{req.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <TreasuryCard />

      </div>
    </div>
  );
};

export default AdminDashboard;