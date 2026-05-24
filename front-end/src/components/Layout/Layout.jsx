import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import styles from "./layout.module.css";
import { useEffect } from "react";

export default function Layout() {
    const { pathname } = useLocation();

    useEffect(()=> {
        window.scrollTo(0,0);
    }, [pathname])

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
