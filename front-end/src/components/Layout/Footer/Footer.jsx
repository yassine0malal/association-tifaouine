// import styles from "./footer.module.css";
// import tifaouine from "../../../assets/images/logo.png";
// import { Link } from "react-router-dom";
// import i18n from "../../../i18n";
// import { useTranslation } from "react-i18next";
// import { useEffect } from "react";
// import { useState } from "react";
// import axios from "axios";

// export default function Footer() {
//     const { t } = useTranslation("footer");
//     const currentYear = new Date().getFullYear();

//     const [email, setEmail] = useState("");
//     const [website, setWebsite] = useState(""); // Honeypot field
//     const [csrfToken, setCsrfToken] = useState("");
//     const [status, setStatus] = useState({ loading: false, message: "", type: "" });
//     const VITE_BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;
//     // 1. Fetch CSRF Token on mount or focus
//     useEffect(() => {
//         const fetchToken = async () => {
//             try {
//                 const response = await axios.get("/api/abonnement/csrf-token", { withCredentials: true });
//                 setCsrfToken(response.data.csrfToken);
//             } catch (err) {
//                 console.error("Failed to fetch CSRF token");
//             }
//         };
//         fetchToken();
//     }, []);



//     // 2. Handle Submission
//     const handleSubscribe = async (e) => {
//         e.preventDefault();
//         setStatus({ loading: true, message: "", type: "" });

//         try {
//             const response = await axios.post(`${VITE_BASE_BACK_END_URL}/api/abonnement`,
//                 { email, website }, // 'website' is the honeypot
//                 {
//                     headers: { "x-csrf-token": csrfToken },
//                     withCredentials: true
//                 }
//             );

//             setStatus({ loading: false, message: response.data.message, type: "success" });
//             setEmail("");
//         } catch (err) {
//             setStatus({
//                 loading: false,
//                 message: err.response?.data?.message || "Une erreur est survenue",
//                 type: "error"
//             });
//         }
//     };

//     console.log("token ===>", csrfToken)

//     return (
//         <>
//             <div className={styles.warper}>
//                 <div className={styles.innerWarper}>
//                     <div className={styles.heroFooter}>
//                         {/* Adresse */}
//                         <div className={styles.card}>
//                             <div className={styles.icon}>
//                                 <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="24px" width="24px" version="1.1" id="_x32_" viewBox="0 0 512 512" xmlSpace="preserve" fill="var(--bg)">
//                                     <style type="text/css"></style>
//                                     <g>
//                                         <path className="st0" d="M255.996,0C145.058,0,55.138,89.929,55.138,200.866c0,68.454,34.648,128.363,86.55,165.174   c47.356,33.594,57.811,41.609,74.462,73.4c13.174,25.147,34.541,69.279,34.541,69.279c1.004,2.008,3.052,3.281,5.306,3.281   c2.244,0,4.31-1.274,5.313-3.281c0,0,21.368-44.132,34.541-69.279c16.642-31.791,27.106-39.806,74.454-73.4   c51.91-36.811,86.558-96.72,86.558-165.174C456.862,89.929,366.925,0,255.996,0z M255.996,335.473   c-74.331,0-134.599-60.268-134.599-134.608c0-74.339,60.268-134.607,134.599-134.607c74.339,0,134.606,60.268,134.606,134.607   C390.602,275.205,330.335,335.473,255.996,335.473z" />
//                                     </g>
//                                 </svg>
//                             </div>
//                             <div className={styles.textContent}>
//                                 <h3>{t("address.title")}</h3>
//                                 <p>{t("address.line")}</p>
//                             </div>
//                         </div>

//                         {/* Téléphone */}
//                         <div className={styles.card}>
//                             <div className={styles.icon}>
//                                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 0 24 24" fill="var(--bg)">
//                                     <path d="M3.51089 2L7.15002 2.13169C7.91653 2.15942 8.59676 2.64346 8.89053 3.3702L9.96656 6.03213C10.217 6.65159 10.1496 7.35837 9.78693 7.91634L8.40831 10.0375C9.22454 11.2096 11.4447 13.9558 13.7955 15.5633L15.5484 14.4845C15.9939 14.2103 16.5273 14.1289 17.0314 14.2581L20.5161 15.1517C21.4429 15.3894 22.0674 16.2782 21.9942 17.2552L21.7705 20.2385C21.6919 21.2854 20.8351 22.1069 19.818 21.9887C6.39245 20.4276 -1.48056 1.99997 3.51089 2Z" stroke="var(--bg)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
//                                 </svg>
//                             </div>
//                             <div className={styles.textContent}>
//                                 <h3>{t("phone.title")}</h3>
//                                 <a dir="ltr" href={`tel:${t("phone.number")}`}>{t("phone.number")}</a>
//                             </div>
//                         </div>

//                         {/* Email */}
//                         <div className={styles.card}>
//                             <div className={styles.icon}>
//                                 <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="24px" width="24px" version="1.1" id="_x32_" viewBox="0 0 512 512" xmlSpace="preserve" fill="var(--bg)">
//                                     <style type="text/css"></style>
//                                     <g>
//                                         <path className="st0" d="M440.917,67.925H71.083C31.827,67.925,0,99.752,0,139.008v233.984c0,39.256,31.827,71.083,71.083,71.083   h369.834c39.255,0,71.083-31.827,71.083-71.083V139.008C512,99.752,480.172,67.925,440.917,67.925z M178.166,321.72l-99.54,84.92   c-7.021,5.992-17.576,5.159-23.567-1.869c-5.992-7.021-5.159-17.576,1.87-23.567l99.54-84.92c7.02-5.992,17.574-5.159,23.566,1.87   C186.027,305.174,185.194,315.729,178.166,321.72z M256,289.436c-13.314-0.033-26.22-4.457-36.31-13.183l0.008,0.008l-0.032-0.024   c0.008,0.008,0.017,0.008,0.024,0.016L66.962,143.694c-6.98-6.058-7.723-16.612-1.674-23.583c6.057-6.98,16.612-7.723,23.582-1.674   l152.771,132.592c3.265,2.906,8.645,5.004,14.359,4.971c5.706,0.017,10.995-2.024,14.44-5.028l0.074-0.065l152.615-132.469   c6.971-6.049,17.526-5.306,23.583,1.674c6.048,6.97,5.306,17.525-1.674,23.583l-152.77,132.599   C282.211,284.929,269.322,289.419,256,289.436z M456.948,404.771c-5.992,7.028-16.547,7.861-23.566,1.869l-99.54-84.92   c-7.028-5.992-7.861-16.546-1.869-23.566c5.991-7.029,16.546-7.861,23.566-1.87l99.54,84.92   C462.107,387.195,462.94,397.75,456.948,404.771z" />
//                                     </g>
//                                 </svg>
//                             </div>
//                             <div className={styles.textContent}>
//                                 <h3>{t("email.title")}</h3>
//                                 <a href={`mailto:${t("email.address")}`}>{t("email.address")}</a>
//                             </div>
//                         </div>
//                     </div>

//                     <div className={styles.footerSection}>
//                         {/* Colonne Company */}
//                         <div className={styles.company}>
//                             <img src={tifaouine} alt="" />
//                             <p>{t("company.description")}</p>
//                             <br />
//                             <form className={styles.send} onSubmit={handleSubscribe}>
//                                 {/* Real Input */}
//                                 <input
//                                     type="email"
//                                     required
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     placeholder={t("company.newsletterPlaceholder")}
//                                 />

//                                 {/* Honeypot Field: Hidden from humans, visible to bots */}
//                                 <input
//                                     type="text"
//                                     name="website"
//                                     value={website}
//                                     onChange={(e) => setWebsite(e.target.value)}
//                                     style={{ display: 'none' }}
//                                     tabIndex="-1"
//                                     autoComplete="off"
//                                 />

//                                 <button type="submit" className={styles.sendIcon} disabled={status.loading}>
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24" fill="none">
//                                         <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                                     </svg>
//                                 </button>
//                             </form>
//                             {status.message && (
//                                 <p style={{ color: status.type === "success" ? "green" : "red", fontSize: "12px" }}>
//                                     {status.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Colonne Support */}
//                         <div className={styles.support}>
//                             <h3>{t("support.title")}</h3>
//                             <div className={styles.personnelle}>
//                                 <p>{t("support.associationName")}</p>

//                                 <p>
//                                     {t("support.phoneFax.label")} :{" "}
//                                     <span dir="ltr">{t("support.phoneFax.value")}</span>
//                                 </p>

//                                 <p>
//                                     {t("support.presidentGsm.label")} :{" "}
//                                     <span dir="ltr">{t("support.presidentGsm.value")}</span>
//                                 </p>

//                                 <div className={styles.compte}>
//                                     <b>{t("support.bankAccount.label")} :</b>
//                                 </div>

//                                 <p>
//                                     {t("support.bankAccount.wafa.label")} :{" "}
//                                     <span dir="ltr">{t("support.bankAccount.wafa.value")}</span>
//                                 </p>

//                                 <p>
//                                     {t("support.bankAccount.creditAgricole.label")} :{" "}
//                                     <span dir="ltr">{t("support.bankAccount.creditAgricole.value")}</span>
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Navigation principale */}
//                         <div className={styles.siteMap}>
//                             <h3>{t("mainNavigation.title")}</h3>
//                             <nav>
//                                 <Link to={`/${i18n.language}/nous`}> {i18n.language != "ar" ? ">" : ""} {t("mainNavigation.about")} </Link>
//                                 <Link to={`/${i18n.language}/projets`}>{i18n.language != "ar" ? ">" : ""}  {t("mainNavigation.activities")}</Link>
//                                 <Link to={`/${i18n.language}/benevoles`}>{i18n.language != "ar" ? ">" : ""}  {t("mainNavigation.participate")}</Link>
//                                 <Link to={`/${i18n.language}/domains`}>{i18n.language != "ar" ? ">" : ""} {t("mainNavigation.domains")}</Link>
//                                 <Link to={`/${i18n.language}/rapports`}>{i18n.language != "ar" ? ">" : ""}  {t("mainNavigation.resources")}</Link>
//                             </nav>
//                         </div>

//                         {/* Liens rapides */}
//                         <div className={styles.quickLinks}>
//                             <h3>{t("quickLinks.title")}</h3>
//                             <nav>
//                                 <Link to={`/${i18n.language}/benevoles`}> {i18n.language != "ar" ? ">" : ""}  {t("quickLinks.becomeMember")}</Link>
//                                 <Link to={`/${i18n.language}/benevoles`}> {i18n.language != "ar" ? ">" : ""}  {t("quickLinks.becomeVolunteer")}</Link>
//                                 <Link to={`/${i18n.language}/evenement`}> {i18n.language != "ar" ? ">" : ""}  {t("quickLinks.seeEvents")}</Link>
//                                 <Link to={`/${i18n.language}/contact`}> {i18n.language != "ar" ? ">" : ""}  {t("quickLinks.contact")}</Link>
//                                 <Link to={`/${i18n.language}/partners`}> {i18n.language != "ar" ? ">" : ""}  {t("quickLinks.partners")}</Link>
//                             </nav>
//                         </div>
//                     </div>
//                 </div>

//                 {/* =====Social Media Part=====  */}
//                 <div className={styles.socialNetwork}>
//                     <div className={styles.net}>
//                         {/* Facebook */}
//                         <a href="">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 32 32" fill="none">
//                                 <g fill="none" fillRule="evenodd">
//                                     <path d="M0 0h32v32H0z" fill="none" />
//                                     <path d="M16 32C7.1625 32 0 24.8375 0 16S7.1625 0 16 0s16 7.1625 16 16-7.1625 16-16 16zm4.43125-23.88438c-.55313-.07812-1.33438-.11562-2.34063-.11562-1.18437 0-2.13125.32812-2.84375.98437-.7125.65625-1.06875 1.58125-1.06875 2.77188v2.09375h-2.61562v2.84375h2.61875v7.2875h3.14062v-7.29375h2.60625l.4-2.84063h-3.00625v-1.81562c0-.4625.10313-.80625.30938-1.0375.20625-.22813.6-.34375 1.1875-.34375h1.6125v-2.73438z" fill="var(--accent)" fillRule="nonzero" />
//                                 </g>
//                             </svg>
//                         </a>

//                         {/* Instagram */}
//                         <a href="">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 32 32">
//                                 <g fill="var(--bg)" fillRule="evenodd">
//                                     <path d="M0 0h32v32H0z" />
//                                     <path d="M17.0830929.03277248c8.1190907 0 14.7619831 6.64289236 14.7619831 14.76198302v2.3064326c0 8.1190906-6.6429288 14.761983-14.7619831 14.761983h-2.3064325c-8.11909069 0-14.76198306-6.6428924-14.76198306-14.761983v-2.3064326c0-8.11909066 6.64289237-14.76198302 14.76198306-14.76198302zm-.8630324 8.0002641-.2053832-.0002641c-1.7102378 0-3.4204757.05652851-3.4204757.05652851-2.4979736 0-4.52299562 2.02501761-4.52299562 4.52298561 0 0-.05191606 1.4685349-.05624239 3.0447858l-.00028625.2060969c0 1.7648596.05652864 3.590089.05652864 3.5900891 0 2.497968 2.02502202 4.5229856 4.52299562 4.5229856 0 0 1.5990132.0565285 3.2508899.0565285 1.7648634 0 3.6466255-.0565285 3.6466255-.0565285 2.4979736 0 4.4664317-1.9684539 4.4664317-4.4664219 0 0 .0565286-1.8046833.0565286-3.5335605l-.0010281-.4057303c-.0076601-1.5511586-.0555357-3.0148084-.0555357-3.0148084 0-2.4979681-1.9684582-4.46642191-4.4664317-4.46642191 0 0-1.6282521-.05209668-3.2716213-.05626441zm-.2053831 1.43969747c1.4024317 0 3.2005639.04637875 3.2005638.04637875 2.0483524 0 3.3130573 1.2647021 3.3130573 3.31305 0 0 .0463789 1.7674322.0463789 3.1541781 0 1.4176885-.0463789 3.2469355-.0463789 3.2469355 0 2.048348-1.2647049 3.31305-3.3130573 3.31305 0 0-1.5901757.0389711-2.9699093.0454662l-.3697206.0009126c-1.3545375 0-3.0049692-.0463788-3.0049692-.0463788-2.0483172 0-3.36958592-1.321301-3.36958592-3.3695785 0 0-.04637885-1.8359078-.04637885-3.2830941 0-1.3545344.04637885-3.061491.04637885-3.061491 0-2.0483479 1.32130402-3.31305 3.36958592-3.31305 0 0 1.7416035-.04637875 3.1440353-.04637875zm-.0000353 2.46195055c-2.2632951 0-4.0980441 1.8347448-4.0980441 4.098035s1.8347489 4.098035 4.0980441 4.098035 4.0980441-1.8347448 4.0980441-4.098035c0-2.2632901-1.8347489-4.098035-4.0980441-4.098035zm0 1.4313625c1.4727754 0 2.6666784 1.1939004 2.6666784 2.6666725s-1.193903 2.6666726-2.6666784 2.6666726c-1.4727401 0-2.6666784-1.1939005-2.6666784-2.6666726s1.1939031-2.6666725 2.6666784-2.6666725zm4.2941322-2.5685935c-.5468547 0-.9902027.4455321-.9902027.9950991 0 .5495671.443348.9950639.9902027.9950639.5468546 0 .9901674-.4454968.9901674-.9950639 0-.5496023-.4433128-.9950991-.9901674-.9950991z" fill="var(--accent)" fillRule="nonzero" />
//                                 </g>
//                             </svg>
//                         </a>

//                         {/* YouTube */}
//                         <a href="">
//                             <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="var(--accent)" height="40px" width="40px" version="1.1" id="Layer_1" viewBox="-143 145 512 512" xmlSpace="preserve">
//                                 <g>
//                                     <polygon points="78.9,450.3 162.7,401.1 78.9,351.9" />
//                                     <path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M241,446.8L241,446.8 c0,44.1-44.1,44.1-44.1,44.1H29.1c-44.1,0-44.1-44.1-44.1-44.1v-91.5c0-44.1,44.1-44.1,44.1-44.1h167.8c44.1,0,44.1,44.1,44.1,44.1 V446.8z" />
//                                 </g>
//                             </svg>
//                         </a>

//                         {/* WhatsApp */}
//                         <a href="">
//                             <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="40px" width="40px" viewBox="0 0 20 20" version="1.1">
//                                 <title>whatsapp [#128]</title>
//                                 <desc>Created with Sketch.</desc>
//                                 <defs></defs>
//                                 <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
//                                     <g id="Dribbble-Light-Preview" transform="translate(-300.000000, -7599.000000)" fill="var(--accent)">
//                                         <g id="icons" transform="translate(56.000000, 160.000000)">
//                                             <path d="M259.821,7453.12124 C259.58,7453.80344 258.622,7454.36761 257.858,7454.53266 C257.335,7454.64369 256.653,7454.73172 254.355,7453.77943 C251.774,7452.71011 248.19,7448.90097 248.19,7446.36621 C248.19,7445.07582 248.934,7443.57337 250.235,7443.57337 C250.861,7443.57337 250.999,7443.58538 251.205,7444.07952 C251.446,7444.6617 252.034,7446.09613 252.104,7446.24317 C252.393,7446.84635 251.81,7447.19946 251.387,7447.72462 C251.252,7447.88266 251.099,7448.05372 251.27,7448.3478 C251.44,7448.63589 252.028,7449.59418 252.892,7450.36341 C254.008,7451.35771 254.913,7451.6748 255.237,7451.80984 C255.478,7451.90987 255.766,7451.88687 255.942,7451.69881 C256.165,7451.45774 256.442,7451.05762 256.724,7450.6635 C256.923,7450.38141 257.176,7450.3464 257.441,7450.44643 C257.62,7450.50845 259.895,7451.56477 259.991,7451.73382 C260.062,7451.85686 260.062,7452.43903 259.821,7453.12124 M254.002,7439 L253.997,7439 L253.997,7439 C248.484,7439 244,7443.48535 244,7449 C244,7451.18666 244.705,7453.21526 245.904,7454.86076 L244.658,7458.57687 L248.501,7457.3485 C250.082,7458.39482 251.969,7459 254.002,7459 C259.515,7459 264,7454.51465 264,7449 C264,7443.48535 259.515,7439 254.002,7439" id="whatsapp-[#128]" />
//                                         </g>
//                                     </g>
//                                 </g>
//                             </svg>
//                         </a>
//                     </div>
//                 </div>

//                 <div className={styles.devider}></div>

//                 <div className={styles.copyrights}>
//                     <p>{t("copyright", { year: currentYear })}</p>
//                 </div>
//             </div >
//         </>
//     );
// }



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

import styles from "./footer.module.css";
import tifaouine from "../../../assets/images/logo.png";

export default function Footer() {
    const { t } = useTranslation("footer");
    const currentYear = new Date().getFullYear();

    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState(""); // Champ Honeypot pour le spam
    const [csrfToken, setCsrfToken] = useState("");
    const [status, setStatus] = useState({ loading: false, message: "", type: "" });

    const VITE_BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

    // 1. Récupération du jeton CSRF au montage du composant
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get(`${VITE_BASE_BACK_END_URL}/api/abonnement/csrf-token`, {
                    withCredentials: true
                });
                setCsrfToken(response.data.csrfToken);
            } catch (err) {
                console.error("Erreur lors de la récupération du jeton CSRF");
            }
        };
        fetchToken();
    }, [VITE_BASE_BACK_END_URL]);

    // 2. Gestion de la soumission du formulaire
    const handleSubscribe = async (e) => {
        e.preventDefault();

        // Si le champ honeypot est rempli, on bloque (probablement un robot)
        if (website) return;

        setStatus({ loading: true, message: "", type: "" });

        try {
            const response = await axios.post(`${VITE_BASE_BACK_END_URL}/api/abonnement`,
                {
                    email: email.trim(),
                    website: website || ""
                },
                {
                    headers: { "x-csrf-token": csrfToken },
                    withCredentials: true
                }
            );

            setStatus({
                loading: false,
                message: response.data.message || "Inscription réussie !",
                type: "success"
            });
            setEmail("");
        } catch (err) {
            setStatus({
                loading: false,
                message: err.response?.data?.message || "Une erreur est survenue",
                type: "error"
            });
        }
    };
    // console.log("ddd", csrfToken)

    return (
        <div className={styles.warper}>
            <div className={styles.innerWarper}>
                <div className={styles.heroFooter}>
                    {/* Adresse */}
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 0 512 512" fill="var(--bg)">
                                <path d="M255.996,0C145.058,0,55.138,89.929,55.138,200.866c0,68.454,34.648,128.363,86.55,165.174 c47.356,33.594,57.811,41.609,74.462,73.4c13.174,25.147,34.541,69.279,34.541,69.279c1.004,2.008,3.052,3.281,5.306,3.281 c2.244,0,4.31-1.274,5.313-3.281c0,0,21.368-44.132,34.541-69.279c16.642-31.791,27.106-39.806,74.454-73.4 c51.91-36.811,86.558-96.72,86.558-165.174C456.862,89.929,366.925,0,255.996,0z M255.996,335.473 c-74.331,0-134.599-60.268-134.599-134.608c0-74.339,60.268-134.607,134.599-134.607c74.339,0,134.606,60.268,134.606,134.607 C390.602,275.205,330.335,335.473,255.996,335.473z" />
                            </svg>
                        </div>
                        <div className={styles.textContent}>
                            <h3>{t("address.title")}</h3>
                            <p>{t("address.line")}</p>
                        </div>
                    </div>

                    {/* Téléphone */}
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 0 24 24" fill="var(--bg)">
                                <path d="M3.51089 2L7.15002 2.13169C7.91653 2.15942 8.59676 2.64346 8.89053 3.3702L9.96656 6.03213C10.217 6.65159 10.1496 7.35837 9.78693 7.91634L8.40831 10.0375C9.22454 11.2096 11.4447 13.9558 13.7955 15.5633L15.5484 14.4845C15.9939 14.2103 16.5273 14.1289 17.0314 14.2581L20.5161 15.1517C21.4429 15.3894 22.0674 16.2782 21.9942 17.2552L21.7705 20.2385C21.6919 21.2854 20.8351 22.1069 19.818 21.9887C6.39245 20.4276 -1.48056 1.99997 3.51089 2Z" stroke="var(--bg)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className={styles.textContent}>
                            <h3>{t("phone.title")}</h3>
                            <a dir="ltr" href={`tel:${t("phone.number")}`}>{t("phone.number")}</a>
                        </div>
                    </div>

                    {/* Email */}
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 0 512 512" fill="var(--bg)">
                                <path d="M440.917,67.925H71.083C31.827,67.925,0,99.752,0,139.008v233.984c0,39.256,31.827,71.083,71.083,71.083 h369.834c39.255,0,71.083-31.827,71.083-71.083V139.008C512,99.752,480.172,67.925,440.917,67.925z M178.166,321.72l-99.54,84.92 c-7.021,5.992-17.576,5.159-23.567-1.869c-5.992-7.021-5.159-17.576,1.87-23.567l99.54-84.92c7.02-5.992,17.574-5.159,23.566,1.87 C186.027,305.174,185.194,315.729,178.166,321.72z M256,289.436c-13.314-0.033-26.22-4.457-36.31-13.183l0.008,0.008l-0.032-0.024 c0.008,0.008,0.017,0.008,0.024,0.016L66.962,143.694c-6.98-6.058-7.723-16.612-1.674-23.583c6.057-6.98,16.612-7.723,23.582-1.674 l152.771,132.592c3.265,2.906,8.645,5.004,14.359,4.971c5.706,0.017,10.995-2.024,14.44-5.028l0.074-0.065l152.615-132.469 c6.971-6.049,17.526-5.306,23.583,1.674c6.048,6.97,5.306,17.525-1.674,23.583l-152.77,132.599 C282.211,284.929,269.322,289.419,256,289.436z M456.948,404.771c-5.992,7.028-16.547,7.861-23.566,1.869l-99.54-84.92 c-7.028-5.992-7.861-16.546-1.869-23.566c5.991-7.029,16.546-7.861,23.566-1.87l99.54,84.92 C462.107,387.195,462.94,397.75,456.948,404.771z" />
                            </svg>
                        </div>
                        <div className={styles.textContent}>
                            <h3>{t("email.title")}</h3>
                            <a href={`mailto:${t("email.address")}`}>{t("email.address")}</a>
                        </div>
                    </div>
                </div>

                <div className={styles.footerSection}>
                    <div className={styles.company}>
                        <img src={tifaouine} alt="Logo Tifaouine" />
                        <p>{t("company.description")}</p>
                        <br />
                        <form className={styles.send} onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("company.newsletterPlaceholder")}
                            />
                            {/* Honeypot Field */}
                            <input
                                type="text"
                                name="website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                style={{ display: 'none' }}
                                tabIndex="-1"
                                autoComplete="off"
                            />
                            <button type="submit" className={styles.sendIcon} disabled={status.loading}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24" fill="none">
                                    <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </form>
                        {status.message && (
                            <p style={{ color: status.type === "success" ? "green" : "red", fontSize: "12px", marginTop: "10px" }}>
                                {status.message}
                            </p>
                        )}
                    </div>

                    <div className={styles.support}>
                        <h3>{t("support.title")}</h3>
                        <div className={styles.personnelle}>
                            <p>{t("support.associationName")}</p>
                            <p>{t("support.phoneFax.label")} : <span dir="ltr">{t("support.phoneFax.value")}</span></p>
                            <p>{t("support.presidentGsm.label")} : <span dir="ltr">{t("support.presidentGsm.value")}</span></p>
                            <div className={styles.compte}><b>{t("support.bankAccount.label")} :</b></div>
                            <p>{t("support.bankAccount.wafa.label")} : <span dir="ltr">{t("support.bankAccount.wafa.value")}</span></p>
                            <p>{t("support.bankAccount.creditAgricole.label")} : <span dir="ltr">{t("support.bankAccount.creditAgricole.value")}</span></p>
                        </div>
                    </div>

                    <div className={styles.siteMap}>
                        <h3>{t("mainNavigation.title")}</h3>
                        <nav>
                            <Link to={`/${i18n.language}/nous`}> {i18n.language !== "ar" ? ">" : ""} {t("mainNavigation.about")} </Link>
                            <Link to={`/${i18n.language}/projets`}>{i18n.language !== "ar" ? ">" : ""} {t("mainNavigation.activities")}</Link>
                            <Link to={`/${i18n.language}/benevoles`}>{i18n.language !== "ar" ? ">" : ""} {t("mainNavigation.participate")}</Link>
                            <Link to={`/${i18n.language}/domains`}>{i18n.language !== "ar" ? ">" : ""} {t("mainNavigation.domains")}</Link>
                            <Link to={`/${i18n.language}/rapports`}>{i18n.language !== "ar" ? ">" : ""} {t("mainNavigation.resources")}</Link>
                        </nav>
                    </div>

                    <div className={styles.quickLinks}>
                        <h3>{t("quickLinks.title")}</h3>
                        <nav>
                            <Link to={`/${i18n.language}/benevoles`}> {i18n.language !== "ar" ? ">" : ""} {t("quickLinks.becomeMember")}</Link>
                            <Link to={`/${i18n.language}/benevoles`}> {i18n.language !== "ar" ? ">" : ""} {t("quickLinks.becomeVolunteer")}</Link>
                            <Link to={`/${i18n.language}/evenement`}> {i18n.language !== "ar" ? ">" : ""} {t("quickLinks.seeEvents")}</Link>
                            <Link to={`/${i18n.language}/contact`}> {i18n.language !== "ar" ? ">" : ""} {t("quickLinks.contact")}</Link>
                            <Link to={`/${i18n.language}/partners`}> {i18n.language !== "ar" ? ">" : ""} {t("quickLinks.partners")}</Link>
                        </nav>
                    </div>
                </div>
            </div>

            <div className={styles.socialNetwork}>
                <div className={styles.net}>
                    {/* Facebook */}
                    <a href="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 32 32" fill="none">
                            <g fill="none" fillRule="evenodd">
                                <path d="M0 0h32v32H0z" fill="none" />
                                <path d="M16 32C7.1625 32 0 24.8375 0 16S7.1625 0 16 0s16 7.1625 16 16-7.1625 16-16 16zm4.43125-23.88438c-.55313-.07812-1.33438-.11562-2.34063-.11562-1.18437 0-2.13125.32812-2.84375.98437-.7125.65625-1.06875 1.58125-1.06875 2.77188v2.09375h-2.61562v2.84375h2.61875v7.2875h3.14062v-7.29375h2.60625l.4-2.84063h-3.00625v-1.81562c0-.4625.10313-.80625.30938-1.0375.20625-.22813.6-.34375 1.1875-.34375h1.6125v-2.73438z" fill="var(--accent)" fillRule="nonzero" />
                            </g>
                        </svg>
                    </a>

                    {/* Instagram */}
                    <a href="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 32 32">
                            <g fill="var(--bg)" fillRule="evenodd">
                                <path d="M0 0h32v32H0z" />
                                <path d="M17.0830929.03277248c8.1190907 0 14.7619831 6.64289236 14.7619831 14.76198302v2.3064326c0 8.1190906-6.6429288 14.761983-14.7619831 14.761983h-2.3064325c-8.11909069 0-14.76198306-6.6428924-14.76198306-14.761983v-2.3064326c0-8.11909066 6.64289237-14.76198302 14.76198306-14.76198302zm-.8630324 8.0002641-.2053832-.0002641c-1.7102378 0-3.4204757.05652851-3.4204757.05652851-2.4979736 0-4.52299562 2.02501761-4.52299562 4.52298561 0 0-.05191606 1.4685349-.05624239 3.0447858l-.00028625.2060969c0 1.7648596.05652864 3.590089.05652864 3.5900891 0 2.497968 2.02502202 4.5229856 4.52299562 4.5229856 0 0 1.5990132.0565285 3.2508899.0565285 1.7648634 0 3.6466255-.0565285 3.6466255-.0565285 2.4979736 0 4.4664317-1.9684539 4.4664317-4.4664219 0 0 .0565286-1.8046833.0565286-3.5335605l-.0010281-.4057303c-.0076601-1.5511586-.0555357-3.0148084-.0555357-3.0148084 0-2.4979681-1.9684582-4.46642191-4.4664317-4.46642191 0 0-1.6282521-.05209668-3.2716213-.05626441zm-.2053831 1.43969747c1.4024317 0 3.2005639.04637875 3.2005638.04637875 2.0483524 0 3.3130573 1.2647021 3.3130573 3.31305 0 0 .0463789 1.7674322.0463789 3.1541781 0 1.4176885-.0463789 3.2469355-.0463789 3.2469355 0 2.048348-1.2647049 3.31305-3.3130573 3.31305 0 0-1.5901757.0389711-2.9699093.0454662l-.3697206.0009126c-1.3545375 0-3.0049692-.0463788-3.0049692-.0463788-2.0483172 0-3.36958592-1.321301-3.36958592-3.3695785 0 0-.04637885-1.8359078-.04637885-3.2830941 0-1.3545344.04637885-3.061491.04637885-3.061491 0-2.0483479 1.32130402-3.31305 3.36958592-3.31305 0 0 1.7416035-.04637875 3.1440353-.04637875zm-.0000353 2.46195055c-2.2632951 0-4.0980441 1.8347448-4.0980441 4.098035s1.8347489 4.098035 4.0980441 4.098035 4.0980441-1.8347448 4.0980441-4.098035c0-2.2632901-1.8347489-4.098035-4.0980441-4.098035zm0 1.4313625c1.4727754 0 2.6666784 1.1939004 2.6666784 2.6666725s-1.193903 2.6666726-2.6666784 2.6666726c-1.4727401 0-2.6666784-1.1939005-2.6666784-2.6666726s1.1939031-2.6666725 2.6666784-2.6666725zm4.2941322-2.5685935c-.5468547 0-.9902027.4455321-.9902027.9950991 0 .5495671.443348.9950639.9902027.9950639.5468546 0 .9901674-.4454968.9901674-.9950639 0-.5496023-.4433128-.9950991-.9901674-.9950991z" fill="var(--accent)" fillRule="nonzero" />
                            </g>
                        </svg>
                    </a>

                    {/* YouTube */}
                    <a href="">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="var(--accent)" height="40px" width="40px" version="1.1" id="Layer_1" viewBox="-143 145 512 512" xmlSpace="preserve">
                            <g>
                                <polygon points="78.9,450.3 162.7,401.1 78.9,351.9" />
                                <path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M241,446.8L241,446.8 c0,44.1-44.1,44.1-44.1,44.1H29.1c-44.1,0-44.1-44.1-44.1-44.1v-91.5c0-44.1,44.1-44.1,44.1-44.1h167.8c44.1,0,44.1,44.1,44.1,44.1 V446.8z" />
                            </g>
                        </svg>
                    </a>

                    {/* WhatsApp */}
                    <a href="">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="40px" width="40px" viewBox="0 0 20 20" version="1.1">
                            <title>whatsapp [#128]</title>
                            <desc>Created with Sketch.</desc>
                            <defs></defs>
                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Dribbble-Light-Preview" transform="translate(-300.000000, -7599.000000)" fill="var(--accent)">
                                    <g id="icons" transform="translate(56.000000, 160.000000)">
                                        <path d="M259.821,7453.12124 C259.58,7453.80344 258.622,7454.36761 257.858,7454.53266 C257.335,7454.64369 256.653,7454.73172 254.355,7453.77943 C251.774,7452.71011 248.19,7448.90097 248.19,7446.36621 C248.19,7445.07582 248.934,7443.57337 250.235,7443.57337 C250.861,7443.57337 250.999,7443.58538 251.205,7444.07952 C251.446,7444.6617 252.034,7446.09613 252.104,7446.24317 C252.393,7446.84635 251.81,7447.19946 251.387,7447.72462 C251.252,7447.88266 251.099,7448.05372 251.27,7448.3478 C251.44,7448.63589 252.028,7449.59418 252.892,7450.36341 C254.008,7451.35771 254.913,7451.6748 255.237,7451.80984 C255.478,7451.90987 255.766,7451.88687 255.942,7451.69881 C256.165,7451.45774 256.442,7451.05762 256.724,7450.6635 C256.923,7450.38141 257.176,7450.3464 257.441,7450.44643 C257.62,7450.50845 259.895,7451.56477 259.991,7451.73382 C260.062,7451.85686 260.062,7452.43903 259.821,7453.12124 M254.002,7439 L253.997,7439 L253.997,7439 C248.484,7439 244,7443.48535 244,7449 C244,7451.18666 244.705,7453.21526 245.904,7454.86076 L244.658,7458.57687 L248.501,7457.3485 C250.082,7458.39482 251.969,7459 254.002,7459 C259.515,7459 264,7454.51465 264,7449 C264,7443.48535 259.515,7439 254.002,7439" id="whatsapp-[#128]" />
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </a>
                </div>
            </div>

            <div className={styles.devider}></div>

            <div className={styles.copyrights}>
                <p>{t("copyright", { year: currentYear })}</p>
            </div>
        </div>
    );
}