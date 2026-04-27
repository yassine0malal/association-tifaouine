import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin, markForceLoggedOut } from "../../../admin/Login/authSlice";
import styles from "./Header.module.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    dispatch(markForceLoggedOut());
};

return (
  <header className={styles.header}>
    <span>👤 {user?.nom || "Admin"}</span>
    <button onClick={handleLogout}>Déconnexion</button>
  </header>
);
};

export default Header;