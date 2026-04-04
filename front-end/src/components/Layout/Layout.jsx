import { Outlet } from "react-router-dom";
import NavBar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import styles from "./layout.module.css";

export default function Layout() {

    return (
        <div className={styles.layout}>
            <NavBar />
            <main >
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}