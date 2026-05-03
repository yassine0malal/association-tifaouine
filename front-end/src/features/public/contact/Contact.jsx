import styles from "./Contact.module.css";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import animationButton from "../../../assets/animations/contact-button.json";
import sendAnimation from "../../../assets/animations/ok.json";
import { useState } from "react";
import PageHero from "../../../components/common/PageHero";
import ImgHero from "../../../assets/images/contact-hero.jpg";
import location from "../../../assets/icons/location.png";
import email from "../../../assets/icons/email.png";
import phone from "../../../assets/icons/phone-call.png";
import whatsapp from "../../../assets/images/whatsapp.svg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"
import { body, form } from "framer-motion/client";
import { protectedApi } from "../../admin/Login/authService";
import axios from "axios";

const VITE_BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export default function Contact() {
    const { t } = useTranslation("contact");

    const objectOptions = [
        { value: 'DEMANDE_PARTENARIAT', label: t('contact.form.object.partenariat') || 'Demande de Partenariat' },
        { value: 'DEMANDE_BENEVOLE', label: t('contact.form.object.benevole') || 'Demande de Bénévole' },
        { value: 'DEMANDE_MEMBRE', label: t('contact.form.object.membre') || 'Demande de Membre' },
        { value: 'DEMANDE_SERVICE', label: t('contact.form.object.service') || 'Demande de Service' },
        { value: 'DEMANDE_INFORMATION', label: t('contact.form.object.information') || "Demande d'Information" },
    ];

    const [isSend, setIsSend] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        object: 'DEMANDE_INFORMATION',
        message: ''
    });

    const [errors, setErrors] = useState({});

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }

    function validate() {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = t('contact.validation.fullNameRequired');
        }

        if (!formData.email.trim()) {
            newErrors.email = t('contact.validation.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('contact.validation.emailInvalid');
        }

        // 🔁 Phone validation removed – backend doesn't expect it
        // if (!formData.phone.trim()) {
        //     newErrors.phone = t('contact.validation.phoneRequired');
        // } else if (!/^[\d\s\+\-\(\)]{8,20}$/.test(formData.phone)) {
        //     newErrors.phone = t('contact.validation.phoneInvalid');
        // }

        if (!formData.object.trim()) {
            newErrors.object = t('contact.validation.subjectRequired');
        }

        if (!formData.message.trim()) {
            newErrors.message = t('contact.validation.messageRequired');
        }

        return newErrors;
    }

    const send = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSend(true);
        setErrors({});

        try {
            const payload = {
                nom_complet: formData.fullName,
                email: formData.email,
                objet: formData.object,
                message: formData.message
            };

            const response = await axios.post(
                `${VITE_BASE_BACK_END_URL}/api/messages`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201 || response.data?.success) {
                setIsSend(true);
                // Optional: reset form
                // setFormData({ fullName: '', email: '', phone: '', object: 'DEMANDE_INFORMATION', message: '' });
            } else {
                throw new Error(response.data?.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setIsSend(false);
            setErrors(prev => ({
                ...prev,
                form: error.response?.data?.message || t('validation.submitError')
            }));
        }
    };

    return (
        <>
            <PageHero title={t('contact.hero.title')} heroImg={ImgHero} />

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
                    <div className={styles.carte}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27289.995421248605!2d-8.00359187117829!3d31.241517757906724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb01ae195aced95%3A0x22df9dee53cf33eb!2sAsni!5e0!3m2!1sen!2sma!4v1775732508977!5m2!1sen!2sma"
                            width="660"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    <form className={styles.form} onSubmit={send}>
                        <h1>{t('contact.form.heading')}</h1>
                        <h3>{t('contact.form.subheading')}</h3>
                        <div className={styles.inputsWarper}>
                            <div className={styles.inputs}>
                                <div className={styles.field}>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder={t('contact.form.placeholders.fullName')}
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                    {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
                                </div>

                                <div className={styles.field}>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        placeholder={t('contact.form.placeholders.email')}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                                </div>

                                <div className={styles.field}>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder={t('contact.form.placeholders.phone')}
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                                </div>

                                {/* 🔁 REPLACED TEXT INPUT WITH DROPDOWN */}
                                <div className={styles.field}>
                                    <select
                                        name="object"
                                        value={formData.object}
                                        onChange={handleChange}
                                    >
                                        {objectOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.object && <span className={styles.error}>{errors.object}</span>}
                                </div>
                            </div>

                            <div className={styles.field}>
                                <textarea
                                    required
                                    placeholder={t('contact.form.placeholders.message')}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                                {errors.message && <span className={styles.error}>{errors.message}</span>}
                            </div>
                        </div>

                        {/* 🔁 Moved errors.form inside the form */}
                        {errors.form && <div className={styles.formError}>{errors.form}</div>}

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
                                </>
                            )}
                            <button>
                                <img src={whatsapp} alt="" />
                                <a href="https://wa.me/212655146069?text=bonjour" target="_blank">
                                    {t('contact.form.placeholders.send-what')}
                                </a>
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </>
    );
}