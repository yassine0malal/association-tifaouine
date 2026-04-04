import { useState } from "react";
import loginStyles from './adminLogin.module.css'
import loginImg from '../../assets/images/login-image.png'
import keyIcon from '../../assets/icons/key.png'
import emailIcon from '../../assets/icons/email2.png'

export default function AdminLogin() {
  // Controlled state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can now access email, password, and rememberMe
    console.log({ email, password, rememberMe });
    // Add your login logic here
  };

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

          <button type="submit" className={loginStyles.btn}>
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
