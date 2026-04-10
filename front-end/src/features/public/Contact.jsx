import styles from "./Contact.module.css";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import animationButton from "../../assets/animations/contact-button.json";
import sendAnimation from "../../assets/animations/ok.json";
import { useState } from "react";
import PageHero from "../../components/common/PageHero";
import heroImg from "../../assets/images/projects_hero.jpg";
import location from "../../assets/icons/location.png";
import email from "../../assets/icons/email.png";
import phone from "../../assets/icons/phone-call.png";

export default function Contact() {
    const [isSend, setIsSend] = useState(false);

    function send(e) {
        e.preventDefault();
        console.log(e.target)
        setIsSend(true);
    }
    return (
        <>
            <PageHero title={"Contact"} heroImg={heroImg} />

            <div className={styles.contactUs}>

                <div className={styles.info}>
                    <h1>Get in touch with us</h1>
                    <p>
                        Fill out the form below or schedule a meeting with us at your convenience.
                    </p>
                    <div className={styles.cards}>
                        <div className={styles.card}>
                            <img src={email} alt="" />

                            <h2>Addresse Email</h2>
                            <p>contact@tifaouine.org</p>

                        </div>
                        <div className={styles.card}>
                            <img src={phone} alt="" />

                            <h2>Numéro de Téléphone</h2>
                            <p>+212 655146069</p>

                        </div>
                        <div className={styles.card}>
                            <img src={location} alt="asni marrakech" />

                            <h2>Adresse / Location</h2>
                            <p>14 Rue El Moutanabi, Marrakech 40000</p>

                        </div>
                    </div>
                </div>

                <div className={styles.contactUsSection}>
                    {/* Map Container */}
                    <div className={styles.carte}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27289.995421248605!2d-8.00359187117829!3d31.241517757906724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb01ae195aced95%3A0x22df9dee53cf33eb!2sAsni!5e0!3m2!1sen!2sma!4v1775732508977!5m2!1sen!2sma" // Use a valid Embed URL
                            width="600"
                            height="450"
                            style={{ border: 0 }} // React object style
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>

                    {/* Form Container */}
                    <form className={styles.form} onSubmit={(e) => send(e)}>
                        <h1>Contactez nous </h1>
                        <h3>Vous avez une question ?</h3>
                        <div className={styles.inputsWarper}>
                            <div className={styles.inputs}>
                                <input required type="text" name="full-name" placeholder="Nom & Prenom" />
                                <input required type="email" name="email" placeholder="Email" />
                                <input required type="tel" name="phone" placeholder="Téléphone" />
                                <input required type="text" name="object" placeholder="Objet" />
                            </div>
                            <textarea required placeholder="Message" name="message"></textarea>
                        </div>
                        <div className={styles.sendButton}>
                            {
                                isSend ?
                                    <DotLottieReact className={styles.sendAnimation} data={sendAnimation} loop={false} autoplay />
                                    :
                                    <button type="submit">

                                        <DotLottieReact className={styles.lottiePlayer} style={{ backgroundColor: "transparent" }} data={animationButton} loop={!isSend} autoplay />
                                    </button>
                            } 
                        </div>
                    </form>
                    
                </div>
            </div>
        </>
    );
}