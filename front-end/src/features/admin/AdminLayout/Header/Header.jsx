import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import profile from '../../../../assets/images/profile.png'
import { logoutAdmin, markForceLoggedOut } from "../../../admin/Login/authSlice";
import styles from "./Header.module.css";
import logo from "../../../../assets/images/logo.png"
import { fetchUnreadCount } from "../../Notifications/adminNotificationsSlice";
import { useEffect } from "react";


const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  // const { unreadCount, loading, error } = useSelector(
  //   (state) => state.adminNotifications
  // );
  
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // ← pull unreadCount from the notifications slice instead of local state
  const unreadCount = useSelector((state) => state.adminNotifications?.unreadCount ?? 0);
  const hasUnread = unreadCount > 0;

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    dispatch(markForceLoggedOut());
  };

  // In your admin Layout component
  useEffect(() => {
    dispatch(fetchUnreadCount()); // lightweight — just the count
  }, [dispatch]);


  return (
    <header className={styles.header}>

      <div className={styles.responsiveLogoMenu}>
        <svg onClick={onMenuClick} xmlns="http://www.w3.org/2000/svg" width="60" height="80" viewBox="0 0 24 24" fill="none">
          <rect width="4" height="4" fill="white" />
          <path d="M6 12H18" stroke="var(--accent)" />
          <path d="M6 15.5H18" stroke="var(--accent)" />
          <path d="M6 8.5H18" stroke="var(--accent)" />
        </svg>
        <div className={styles.logo} onClick={()=>navigate('/admin')} >
          <img src={logo} alt="Tifaouine Logo" />
        </div>
      </div>

      <div className={styles.inputFieled}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
          <path opacity="0" d="M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" fill="#323232" />
          <path d="M17 17L21 21" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#323232" strokeWidth="2" />
        </svg>
        <input type="text" name="search" id="search" placeholder="Universal Search" />

        <div className={styles.cmd}>
          <svg xmlns="http://www.w3.org/2000/svg" width="13px" height="13px" viewBox="0 0 24 24" fill="none">
            <path d="M8 8H16V16H8V8Z" stroke="#1C274C" strokeWidth="1.5" />
            <path d="M16 16.001L19 16.0005C20.6569 16.0002 22.0002 17.3432 22.0005 19C22.0007 20.6569 20.6578 22.0002 19.0009 22.0005C17.3441 22.0007 16.0007 20.6578 16.0005 19.001L16 16.001Z" stroke="#1C274C" strokeWidth="1.5" />
            <path d="M8.00096 16.001L5.00096 16.0005C3.34411 16.0002 2.00075 17.3432 2.00049 19C2.00023 20.6569 3.34316 22.0002 5.00002 22.0005C6.65687 22.0007 8.00023 20.6578 8.00049 19.001L8.00096 16.001Z" stroke="#1C274C" strokeWidth="1.5" />
            <path d="M16 8.00002L19 8.00049C20.6569 8.00075 22.0002 6.65781 22.0005 5.00096C22.0007 3.34411 20.6578 2.00075 19.0009 2.00049C17.3441 2.00023 16.0007 3.34316 16.0005 5.00002L16 8.00002Z" stroke="#1C274C" strokeWidth="1.5" />
            <path d="M8.00096 8.00002L5.00096 8.00049C3.34411 8.00075 2.00075 6.65781 2.00049 5.00096C2.00023 3.34411 3.34316 2.00075 5.00002 2.00049C6.65687 2.00023 8.00023 3.34316 8.00049 5.00002L8.00096 8.00002Z" stroke="#1C274C" strokeWidth="1.5" />
          </svg>
          <span>F</span>
        </div>
      </div>

      <div className={styles.account} onClick={() => navigate("/admin/notifications")}>

        <div className={styles.notification}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
            <path
              fill="#000000"
              d="M12,23a2,2,0,0,1-2-2h4A2,2,0,0,1,12,23ZM20.707,17.293L19,15.586V10H17v6a1,1,0,0,0,.293.707l.293.293H6.414l.293-.293A1,1,0,0,0,7,16V10a4.98,4.98,0,0,1,5.912-4.912L14.5,3.5a.913.913,0,0,0-.168-.1A7,7,0,0,0,13,3.084V2a1,1,0,0,0-2,0V3.08A7,7,0,0,0,5,10v5.586L3.293,17.293A1,1,0,0,0,4,19H20a1,1,0,0,0,.707-1.707Z"
            />
            {/* Red when unread notifications exist, black when none */}
            <path
              fill={hasUnread ? "#FF0000" : "#000000"}
              d="M20,6a2,2,0,1,0-2,2A2,2,0,0,0,20,6Z"
            />
          </svg>
          <span>|</span>
        </div>

        <div className={styles.profileInfo}>
          <img src={profile} alt="" />
          <div className={styles.accountText}>
            <span>{user?.nom || "Admin"}</span>
            <span>{user?.email || "Admin@tifaouine.org"}</span>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;