import { useEffect, useState } from "react";
import loginStyles from './adminLogin.module.css'
import loginImg from '../../../assets/images/login-image.png'
import keyIcon from '../../../assets/icons/key.png'
import emailIcon from '../../../assets/icons/email2.png'
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin, resetAuthError, restoreSession } from "./authSlice";
import Loader from "../../../components/common/Loader";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  // Controlled state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [redirecting, setRedirecting] = useState(false);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     setRedirecting(true);
  //     setTimeout(() => {
  //       console.log("redirection 0000000")
  //       navigate("/admin", { replace: true });
  //     }, 500);
  //   }
  // }, [isAuthenticated, navigate]);

  // already auth
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  //delete errors
  useEffect(() => {
    dispatch(resetAuthError());
  }, [dispatch]);


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
    dispatch(loginAdmin({ email, password }));
  };

  if (loading) return <Loader />;
  // { redirecting && <p>Redirecting to dashboard…</p> }












  return (
    <div className={loginStyles.container}>
      <div className={loginStyles.loginContainer}>
        <h1 className={loginStyles.loginTitle}>
          Log into <br />Admin
        </h1>
        <div className={loginStyles.imageContainer}>
          <img src={loginImg} alt="login image" />
        </div>

        <form className={loginStyles.loginForm} onSubmit={handleSubmit}>
          <h1 className={loginStyles.loginTitle}>
            Log into <br />Admin
          </h1>

          <div className={loginStyles.inputWrap}>
            <img src={emailIcon} alt="email icon" aria-hidden="true" />
            <input
              type="email"
              placeholder="Email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={loginStyles.inputWrap}>
            <img src={keyIcon} alt="key icon" aria-hidden="true" />
            <input
              type="password"
              placeholder="Password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={loginStyles.rememberMe}>
            <label className={loginStyles.customCheckbox}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span></span>
              Remember me
            </label>
          </div>
          {error && <p className={loginStyles.error}>{error}</p>}


          <button type="submit" className={loginStyles.btn} disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
