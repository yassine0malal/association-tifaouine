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
import whatsapp from "../../assets/images/whatsapp.svg";
import { useTranslation } from "react-i18next";
import {Link} from "react-router-dom"
export default function Contact() {
    const [isSend, setIsSend] = useState(false);
    const { t } = useTranslation("contact");
    function send(e) {
        e.preventDefault();
        console.log(e.target)
        setIsSend(true);
    }
    return (
        <>
            <PageHero title={t('contact.hero.title')} heroImg={heroImg} />

            <div className={styles.contactUs}>
                <div className={styles.info}>
                    <h1>{t('contact.info.heading')}</h1>
                    <p>{t('contact.info.subheading')}</p>
                    <div className={styles.cards}>
                        <div className={styles.card}>
                            <img src={email} alt="" />
                            <h2>{t('contact.info.cards.email.title')}</h2>
                            <p>{t('contact.info.cards.email.value')}</p>
                        </div>
                        <div className={styles.card}>
                            <img src={phone} alt="" className={styles.phoneNumber} />
                            <h2>{t('contact.info.cards.phone.title')}</h2>
                            <p>{t('contact.info.cards.phone.value')}</p>
                        </div>
                        <div className={styles.card}>
                            <img src={location} alt="asni marrakech" />
                            <h2>{t('contact.info.cards.location.title')}</h2>
                            <p>{t('contact.info.cards.location.value')}</p>
                        </div>
                    </div>
                </div>

                <section className={styles.contactUsSection}>
                    {/* Map Container */}
                    <div className={styles.carte}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27289.995421248605!2d-8.00359187117829!3d31.241517757906724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb01ae195aced95%3A0x22df9dee53cf33eb!2sAsni!5e0!3m2!1sen!2sma!4v1775732508977!5m2!1sen!2sma"
                            width="660"
                            // height=""
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    {/* Form Container */}
                    <form className={styles.form} onSubmit={(e) => send(e)}>
                        <h1>{t('contact.form.heading')}</h1>
                        <h3>{t('contact.form.subheading')}</h3>
                        <div className={styles.inputsWarper}>
                            <div className={styles.inputs}>
                                <input
                                    required
                                    type="text"
                                    name="full-name"
                                    placeholder={t('contact.form.placeholders.fullName')}
                                />
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    placeholder={t('contact.form.placeholders.email')}
                                />
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    placeholder={t('contact.form.placeholders.phone')}
                                />
                                <input
                                    required
                                    type="text"
                                    name="object"
                                    placeholder={t('contact.form.placeholders.subject')}
                                />
                            </div>
                            <textarea
                                required
                                placeholder={t('contact.form.placeholders.message')}
                                name="message"
                            ></textarea>
                        </div>
                        <div className={styles.sendButton}>
                            {isSend ? (
                                <DotLottieReact
                                    className={styles.sendAnimation}
                                    data={sendAnimation}
                                    loop={false}
                                    autoplay
                                />
                            ) : (
                                <>
                                    <button type="submit">
                                        {t('contact.form.placeholders.send')}
                                    </button>

                                    <button>
                                        <img src={whatsapp} alt="" />
                                        <a  href="https://wa.me/212655146069?text=bonjour" target="_blank">  {t('contact.form.placeholders.send-what')}</a>
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </section>
            </div>
        </>
    );
}