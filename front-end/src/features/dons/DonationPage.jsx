import styles from "./donation-page.module.css";
import mountainImg from "../../assets/images/tob9al_mountain.jpg";
import PageHero from "../../components/common/PageHero";
import contactImg from "../../assets/images/donation/contact_img.jpg";
import transparency_img1 from "../../assets/images/donation/transpaerncy_img1.jpeg";
import transparency_img2 from "../../assets/images/donation/transpaerncy_img2.jpeg";
import transparency_img3 from "../../assets/images/donation/transpaerncy_img3.jpeg";
import transparency_img4 from "../../assets/images/donation/transpaerncy_img4.jpeg";
import transparency_img5 from "../../assets/images/donation/transpaerncy_img5.jpeg";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchProjectsForSelect } from "../projets/projects-list/projectsSlice";
import axios from "axios";

// ─── Validation helpers ───────────────────────────────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function validateField(name, value) {
  switch (name) {
    case "fullname":
      if (!value.trim()) return "Full name is required.";
      if (value.trim().length < 2) return "Must be at least 2 characters.";
      return "";

    case "email":
      if (!value.trim()) return "Email is required.";
      if (!emailRegex.test(value)) return "Enter a valid email address.";
      return "";

    case "amount":
      if (value === "" || value === 0 || value === "0") return ""; // optional
      if (Number(value) <= 0) return "Amount must be a positive number.";
      return "";

    case "project":
      if (!value) return "Please select a project.";
      return "";

    case "receipt":
      if (!value) return "Please upload your receipt.";
      if (!ALLOWED_TYPES.includes(value.type))
        return "Only PDF, JPG, or PNG files are allowed.";
      if (value.size > MAX_FILE_SIZE) return "File size must not exceed 5 MB.";
      return "";

    default:
      return "";
  }
}

function validateAll(formData) {
  const fields = ["fullname", "email", "amount", "project", "receipt"];
  const errors = {};
  fields.forEach((field) => {
    const msg = validateField(field, formData[field]);
    if (msg) errors[field] = msg;
  });
  return errors;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function FieldWrapper({ children, error }) {
  return (
    <div className={`${styles.wrapper} ${error ? styles.hasError : ""}`}>
      {children}
      {error && (
        <span className={styles.errorMsg} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

function CurrentNeeds({ t }) {
  const needsData = [
    {
      id: 1,
      title: t("currentNeeds.needsData.0.title"),
      description: t("currentNeeds.needsData.0.description"),
      funded: 85,
      raised: t("currentNeeds.needsData.0.raised"),
      goal: t("currentNeeds.needsData.0.goal"),
      urgent: true,
      image:
        "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&q=80&fit=crop",
    },
    {
      id: 2,
      title: t("currentNeeds.needsData.1.title"),
      description: t("currentNeeds.needsData.1.description"),
      funded: 42,
      raised: t("currentNeeds.needsData.1.raised"),
      goal: t("currentNeeds.needsData.1.goal"),
      urgent: false,
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80&fit=crop",
    },
    {
      id: 3,
      title: t("currentNeeds.needsData.2.title"),
      description: t("currentNeeds.needsData.2.description"),
      funded: 70,
      raised: t("currentNeeds.needsData.2.raised"),
      goal: t("currentNeeds.needsData.2.goal"),
      urgent: true,
      image:
        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80&fit=crop",
    },
    {
      id: 4,
      title: t("currentNeeds.needsData.3.title"),
      description: t("currentNeeds.needsData.3.description"),
      funded: 15,
      raised: t("currentNeeds.needsData.3.raised"),
      goal: t("currentNeeds.needsData.3.goal"),
      urgent: false,
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80&fit=crop",
    },
  ];

  const galleryData = [
    {
      id: 1,
      label: t("currentNeeds.galleryData.0.label"),
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80&fit=crop",
    },
    {
      id: 2,
      label: t("currentNeeds.galleryData.1.label"),
      image:
        "https://images.unsplash.com/photo-1556484687-30636164638b?w=600&q=80&fit=crop",
    },
    {
      id: 3,
      label: t("currentNeeds.galleryData.2.label"),
      image:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80&fit=crop",
    },
  ];

  return (
    <section className={styles.currentNeeds}>
      {/* Section Header */}
      <h2 className={styles.title}>{t("currentNeeds.title")}</h2>
      <p className={styles.subtitle}>{t("currentNeeds.subtitle")}</p>

      {/* Need Cards */}
      <div className={styles.cardsGrid}>
        {needsData.map((need) => (
          <div className={styles.card} key={need.id}>
            <div className={styles.cardImageWrapper}>
              <img src={need.image} alt={need.title} />
              {need.urgent && (
                <span className={styles.urgentBadge}>
                  ! {t("currentNeeds.urgent")}
                </span>
              )}
            </div>
            <div className={styles.cardBody}>
              <h3>{need.title}</h3>
              <p>{need.description}</p>
              <div className={styles.progress}>
                <div className={styles.progressMeta}>
                  <span className={styles.fundedLabel}>
                    {need.funded}
                    {t("currentNeeds.funded")}
                  </span>
                  <span className={styles.amountLabel}>
                    {need.raised} / {need.goal}
                  </span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${need.funded}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Impact Gallery */}
      <div className={styles.gallery}>
        {galleryData.map((item) => (
          <div className={styles.galleryCard} key={item.id}>
            <img src={item.image} alt={item.label} />
            <div className={styles.galleryOverlay} />
            <span className={styles.galleryLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DonateInfosSection({ t }) {
  const PHONE_NUMBER = "+212636338100";
  const EMAIL = "chargaoui2001@gmail.com";
  const WHATSAPP = `https://wa.me/${PHONE_NUMBER}`;

  function Wrapper({ name, children, data }) {
    const [isCopied, setCopied] = useState(false);
    const copyToClipBoard = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(data);
      } else {
        // fallback
        const textarea = document.createElement("textarea");
        textarea.value = data;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className={styles.wrapper}>
        <p className={styles.title}>{name}</p>
        <div className={styles.data}>
          <div>{children}</div>
          <button onClick={copyToClipBoard} className={styles.copybtn}>
            {isCopied ? (
              <svg
                className={styles.checkedIcon}
                xmlns="http://www.w3.org/2000/svg"
                width="25px"
                height="25px"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16.5163 8.93451L11.0597 14.7023L8.0959 11.8984"
                  stroke="#006e0f"
                  strokeWidth="2"
                />
                <path
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                  stroke="#006e0f"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg
                className={styles.copyIcon}
                width="20"
                height="20"
                viewBox="0 0 22 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 20C6.8125 20 6.22396 19.7552 5.73438 19.2656C5.24479 18.776 5 18.1875 5 17.5V2.5C5 1.8125 5.24479 1.22396 5.73438 0.734375C6.22396 0.244792 6.8125 0 7.5 0H18.75C19.4375 0 20.026 0.244792 20.5156 0.734375C21.0052 1.22396 21.25 1.8125 21.25 2.5V17.5C21.25 18.1875 21.0052 18.776 20.5156 19.2656C20.026 19.7552 19.4375 20 18.75 20H7.5ZM7.5 17.5H18.75V2.5H7.5V17.5ZM2.5 25C1.8125 25 1.22396 24.7552 0.734375 24.2656C0.244792 23.776 0 23.1875 0 22.5V5H2.5V22.5H16.25V25H2.5Z"
                  fill="#845417"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  }
  return (
    <section className={styles.donateInfos}>
      <div className={styles.container}>
        <div className={styles.bankInfos}>
          <h3>{t("donateInfos.directSupport.title")}</h3>
          <h2>{t("donateInfos.directSupport.subtitle")}</h2>
          <p>{t("donateInfos.directSupport.description")}</p>

          <div className={styles.card}>
            <div className={styles.doubleWrapper}>
              <Wrapper
                name={t("donateInfos.directSupport.accountName")}
                data="Association Tifaouine"
              >
                Association Tifaouine
              </Wrapper>
              <Wrapper
                name={t("donateInfos.directSupport.bankName")}
                data="Attijariwafa Bank"
              >
                Attijariwafa Bank
              </Wrapper>
            </div>

            <Wrapper
              name={t("donateInfos.directSupport.rib")}
              data="12345678901234567890"
            >
              <span>1234</span>
              <span>5678</span>
              <span>9012</span>
              <span>3456</span>
              <span>7890</span>
              <span>1234</span>
            </Wrapper>

            <div className={styles.doubleWrapper}>
              <Wrapper
                name={t("donateInfos.directSupport.iban")}
                data="MA64 1234 5678 ... 12"
              >
                MA64 1234 5678 ... 12
              </Wrapper>
              <Wrapper
                name={t("donateInfos.directSupport.swift")}
                data="AWBAMAMC"
              >
                AWBAMAMC
              </Wrapper>
            </div>
            <div className={styles.trustMsg}>
              <div className={styles.icon}>
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.95 13.55L12.6 7.9L11.175 6.475L6.95 10.7L4.85 8.6L3.425 10.025L6.95 13.55V13.55M8 20C5.68333 19.4167 3.77083 18.0875 2.2625 16.0125C0.754167 13.9375 0 11.6333 0 9.1V3L8 0L16 3V9.1C16 11.6333 15.2458 13.9375 13.7375 16.0125C12.2292 18.0875 10.3167 19.4167 8 20V20M8 17.9C9.73333 17.35 11.1667 16.25 12.3 14.6C13.4333 12.95 14 11.1167 14 9.1V4.375L8 2.125L2 4.375V9.1C2 11.1167 2.56667 12.95 3.7 14.6C4.83333 16.25 6.26667 17.35 8 17.9V17.9M8 10V10V10V10V10V10V10V10V10V10"
                    fill="#006E0F"
                  />
                </svg>
              </div>

              <p>{t("donateInfos.directSupport.trustMessage")}</p>
            </div>
          </div>
        </div>

        <div className={styles.contacts}>
          <div className={styles.card}>
            <h3>{t("donateInfos.contacts.title")}</h3>
            <a
              href={`tel:+${PHONE_NUMBER}`}
              target="_blank"
              className={styles.contactWrapper}
            >
              <div className={styles.icon}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.95 18C14.8667 18 12.8083 17.5458 10.775 16.6375C8.74167 15.7292 6.89167 14.4417 5.225 12.775C3.55833 11.1083 2.27083 9.25833 1.3625 7.225C0.454167 5.19167 0 3.13333 0 1.05C0 0.75 0.1 0.5 0.3 0.3C0.5 0.1 0.75 0 1.05 0H5.1C5.33333 0 5.54167 0.0791667 5.725 0.2375C5.90833 0.395833 6.01667 0.583333 6.05 0.8L6.7 4.3C6.73333 4.56667 6.725 4.79167 6.675 4.975C6.625 5.15833 6.53333 5.31667 6.4 5.45L3.975 7.9C4.30833 8.51667 4.70417 9.1125 5.1625 9.6875C5.62083 10.2625 6.125 10.8167 6.675 11.35C7.19167 11.8667 7.73333 12.3458 8.3 12.7875C8.86667 13.2292 9.46667 13.6333 10.1 14L12.45 11.65C12.6 11.5 12.7958 11.3875 13.0375 11.3125C13.2792 11.2375 13.5167 11.2167 13.75 11.25L17.2 11.95C17.4333 12.0167 17.625 12.1375 17.775 12.3125C17.925 12.4875 18 12.6833 18 12.9V16.95C18 17.25 17.9 17.5 17.7 17.7C17.5 17.9 17.25 18 16.95 18V18M3.025 6L4.675 4.35V4.35V4.35L4.25 2V2V2H2.025V2V2C2.10833 2.68333 2.225 3.35833 2.375 4.025C2.525 4.69167 2.74167 5.35 3.025 6V6M11.975 14.95C12.625 15.2333 13.2875 15.4583 13.9625 15.625C14.6375 15.7917 15.3167 15.9 16 15.95V15.95V15.95V13.75V13.75V13.75L13.65 13.275V13.275V13.275L11.975 14.95V14.95M3.025 6V6V6V6V6V6V6V6V6V6V6V6V6M11.975 14.95V14.95V14.95V14.95V14.95V14.95V14.95V14.95V14.95V14.95V14.95V14.95V14.95"
                    fill="#845417"
                  />
                </svg>
              </div>

              <div>
                <p className={styles.name}>{t("donateInfos.contacts.phone")}</p>
                <p>{`${PHONE_NUMBER.substring(0, 4)} (0) ${PHONE_NUMBER.substring(4, 7)} ${PHONE_NUMBER.substring(7, 9)} ${PHONE_NUMBER.substring(9, 11)} ${PHONE_NUMBER.substring(11, 13)}`}</p>
              </div>
            </a>

            <a
              href={`mailto:${EMAIL}`}
              target="_blank"
              className={styles.contactWrapper}
            >
              <div className={styles.icon}>
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2V16M10 9L2 4V14V14V14H18V14V14V4L10 9V9M10 7L18 2H2L10 7V7M2 4V2V2V4V14V14V14V14V14V14V4V4"
                    fill="#845417"
                  />
                </svg>
              </div>
              <div>
                <p className={styles.name}>{t("donateInfos.contacts.email")}</p>
                <p>{EMAIL}</p>
              </div>
            </a>
            <div className={styles.devider}></div>
            <a href={WHATSAPP} target="_blank" className={styles.whatsapp}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12H12V10H4V12ZM4 9H16V7H4V9ZM4 6H16V4H4V6ZM0 20V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.8042 15.8042 18.55 16 18 16H4L0 20ZM3.15 14H18V8V2H2V15.125L3.15 14Z"
                  fill="white"
                />
              </svg>
              <span>{t("donateInfos.contacts.whatsapp")}</span>
            </a>
          </div>
          <div className={styles.image}>
            <img src={contactImg} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactSection({ t }) {
  function ImpactCard({ amount, description, impactLabel, icon, impactIcon }) {
    return (
      <div className={styles.impactCard}>
        <div className={styles.icon}>{icon}</div>

        <div className={styles.amount}>
          <h2>{amount}</h2>
          <span>{t("impactSection.cards.currency")}</span>
        </div>

        <p className={styles.description}>{description}</p>

        <div className={styles.impact}>
          <div className={styles.icon}>{impactIcon}</div>
          <p>{impactLabel} </p>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.yourImpact}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("impactSection.title")}</h1>
        <p className={styles.subtitle}>{t("impactSection.subtitle")}</p>

        <div className={styles.cards}>
          <ImpactCard
            amount={t("impactSection.cards.education.amount")}
            description={t("impactSection.cards.education.description")}
            impactLabel={t("impactSection.cards.education.impactLabel")}
            icon={
              <svg
                width="33"
                height="30"
                viewBox="0 0 33 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 29.25C15.3 28.3 14 27.5625 12.6 27.0375C11.2 26.5125 9.75 26.25 8.25 26.25C7.2 26.25 6.16875 26.3875 5.15625 26.6625C4.14375 26.9375 3.175 27.325 2.25 27.825C1.725 28.1 1.21875 28.0875 0.73125 27.7875C0.24375 27.4875 0 27.05 0 26.475V8.4C0 8.125 0.06875 7.8625 0.20625 7.6125C0.34375 7.3625 0.55 7.175 0.825 7.05C1.975 6.45 3.175 6 4.425 5.7C5.675 5.4 6.95 5.25 8.25 5.25C9.7 5.25 11.1188 5.4375 12.5063 5.8125C13.8938 6.1875 15.225 6.75 16.5 7.5V25.65C17.775 24.85 19.1125 24.25 20.5125 23.85C21.9125 23.45 23.325 23.25 24.75 23.25C25.65 23.25 26.5312 23.325 27.3937 23.475C28.2562 23.625 29.125 23.85 30 24.15V24.15V24.15V6.15C30.375 6.275 30.7438 6.40625 31.1063 6.54375C31.4688 6.68125 31.825 6.85 32.175 7.05C32.45 7.175 32.6563 7.3625 32.7938 7.6125C32.9313 7.8625 33 8.125 33 8.4V26.475C33 27.05 32.7562 27.4875 32.2687 27.7875C31.7812 28.0875 31.275 28.1 30.75 27.825C29.825 27.325 28.8563 26.9375 27.8438 26.6625C26.8312 26.3875 25.8 26.25 24.75 26.25C23.25 26.25 21.8 26.5125 20.4 27.0375C19 27.5625 17.7 28.3 16.5 29.25V29.25M19.5 21.75V7.5L27 0V15L19.5 21.75V21.75M13.5 24.1875V9.3375C12.675 8.9875 11.8187 8.71875 10.9312 8.53125C10.0437 8.34375 9.15 8.25 8.25 8.25C7.325 8.25 6.425 8.3375 5.55 8.5125C4.675 8.6875 3.825 8.95 3 9.3V9.3V9.3V24.1875V24.1875V24.1875C3.875 23.8625 4.74375 23.625 5.60625 23.475C6.46875 23.325 7.35 23.25 8.25 23.25C9.15 23.25 10.0313 23.325 10.8938 23.475C11.7563 23.625 12.625 23.8625 13.5 24.1875V24.1875M13.5 24.1875V24.1875V24.1875V24.1875V24.1875V24.1875V24.1875V9.3375V9.3375V9.3375V9.3375V9.3375V9.3375V9.3375V24.1875V24.1875"
                  fill="#845417"
                />
              </svg>
            }
            impactIcon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 8.75C11.15 8.75 10.8542 8.62917 10.6125 8.3875C10.3708 8.14583 10.25 7.85 10.25 7.5C10.25 7.15 10.3708 6.85417 10.6125 6.6125C10.8542 6.37083 11.15 6.25 11.5 6.25C11.85 6.25 12.1458 6.37083 12.3875 6.6125C12.6292 6.85417 12.75 7.15 12.75 7.5C12.75 7.85 12.6292 8.14583 12.3875 8.3875C12.1458 8.62917 11.85 8.75 11.5 8.75ZM6.5 8.75C6.15 8.75 5.85417 8.62917 5.6125 8.3875C5.37083 8.14583 5.25 7.85 5.25 7.5C5.25 7.15 5.37083 6.85417 5.6125 6.6125C5.85417 6.37083 6.15 6.25 6.5 6.25C6.85 6.25 7.14583 6.37083 7.3875 6.6125C7.62917 6.85417 7.75 7.15 7.75 7.5C7.75 7.85 7.62917 8.14583 7.3875 8.3875C7.14583 8.62917 6.85 8.75 6.5 8.75ZM9 14C8 14 7.09583 13.725 6.2875 13.175C5.47917 12.625 4.88333 11.9 4.5 11H13.5C13.1167 11.9 12.5208 12.625 11.7125 13.175C10.9042 13.725 10 14 9 14ZM9 18C7.75 18 6.57917 17.7625 5.4875 17.2875C4.39583 16.8125 3.44583 16.1708 2.6375 15.3625C1.82917 14.5542 1.1875 13.6042 0.7125 12.5125C0.2375 11.4208 0 10.25 0 9C0 7.75 0.2375 6.57917 0.7125 5.4875C1.1875 4.39583 1.82917 3.44583 2.6375 2.6375C3.44583 1.82917 4.39583 1.1875 5.4875 0.7125C6.57917 0.2375 7.75 0 9 0C10.25 0 11.4208 0.2375 12.5125 0.7125C13.6042 1.1875 14.5542 1.82917 15.3625 2.6375C16.1708 3.44583 16.8125 4.39583 17.2875 5.4875C17.7625 6.57917 18 7.75 18 9C18 10.25 17.7625 11.4208 17.2875 12.5125C16.8125 13.6042 16.1708 14.5542 15.3625 15.3625C14.5542 16.1708 13.6042 16.8125 12.5125 17.2875C11.4208 17.7625 10.25 18 9 18ZM9 16C10.9333 16 12.5833 15.3167 13.95 13.95C15.3167 12.5833 16 10.9333 16 9C16 7.06667 15.3167 5.41667 13.95 4.05C12.5833 2.68333 10.9333 2 9 2C8.9 2 8.8 2 8.7 2C8.6 2 8.5 2.01667 8.4 2.05C8.3 2.15 8.23333 2.25833 8.2 2.375C8.16667 2.49167 8.15 2.61667 8.15 2.75C8.15 3.1 8.27083 3.39583 8.5125 3.6375C8.75417 3.87917 9.05 4 9.4 4C9.55 4 9.6875 3.975 9.8125 3.925C9.9375 3.875 10.0667 3.85 10.2 3.85C10.4 3.85 10.5667 3.925 10.7 4.075C10.8333 4.225 10.9 4.4 10.9 4.6C10.9 4.98333 10.7208 5.22917 10.3625 5.3375C10.0042 5.44583 9.68333 5.5 9.4 5.5C8.65 5.5 8.00417 5.22917 7.4625 4.6875C6.92083 4.14583 6.65 3.5 6.65 2.75C6.65 2.7 6.65 2.65 6.65 2.6C6.65 2.55 6.65833 2.48333 6.675 2.4C5.29167 2.9 4.16667 3.74167 3.3 4.925C2.43333 6.10833 2 7.46667 2 9C2 10.9333 2.68333 12.5833 4.05 13.95C5.41667 15.3167 7.06667 16 9 16Z"
                  fill="#006E0F"
                />
              </svg>
            }
          />

          <ImpactCard
            amount={t("impactSection.cards.healthcare.amount")}
            description={t("impactSection.cards.healthcare.description")}
            impactLabel={t("impactSection.cards.healthcare.impactLabel")}
            icon={
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 30C2.175 30 1.46875 29.7062 0.88125 29.1187C0.29375 28.5312 0 27.825 0 27V9C0 8.175 0.29375 7.46875 0.88125 6.88125C1.46875 6.29375 2.175 6 3 6H9V3C9 2.175 9.29375 1.46875 9.88125 0.88125C10.4688 0.29375 11.175 0 12 0H18C18.825 0 19.5312 0.29375 20.1187 0.88125C20.7062 1.46875 21 2.175 21 3V6H27C27.825 6 28.5312 6.29375 29.1187 6.88125C29.7062 7.46875 30 8.175 30 9V27C30 27.825 29.7062 28.5312 29.1187 29.1187C28.5312 29.7062 27.825 30 27 30H3V30M3 27H27V27V27V9V9V9H3V9V9V27V27V27V27M12 6H18V3V3V3H12V3V3V6V6M3 27V27V27V9V9V9V9V9V9V27V27V27V27V27M13.5 19.5V24H16.5V19.5H21V16.5H16.5V12H13.5V16.5H9V19.5H13.5V19.5"
                  fill="#006E0F"
                />
              </svg>
            }
            impactIcon={
              <svg
                width="16"
                height="20"
                viewBox="0 0 16 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.5 13.5H9.5V11H12V8H9.5V5.5H6.5V8H4V11H6.5V13.5ZM8 20C5.68333 19.4167 3.77083 18.0875 2.2625 16.0125C0.754167 13.9375 0 11.6333 0 9.1V3L8 0L16 3V9.1C16 11.6333 15.2458 13.9375 13.7375 16.0125C12.2292 18.0875 10.3167 19.4167 8 20ZM8 17.9C9.73333 17.35 11.1667 16.25 12.3 14.6C13.4333 12.95 14 11.1167 14 9.1V4.375L8 2.125L2 4.375V9.1C2 11.1167 2.56667 12.95 3.7 14.6C4.83333 16.25 6.26667 17.35 8 17.9Z"
                  fill="#006E0F"
                />
              </svg>
            }
          />

          <ImpactCard
            amount={t("impactSection.cards.agriculture.amount")}
            description={t("impactSection.cards.agriculture.description")}
            impactLabel={t("impactSection.cards.agriculture.impactLabel")}
            icon={
              <svg
                width="33"
                height="26"
                viewBox="0 0 33 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 9.3C4.075 9.3 3.71875 9.15625 3.43125 8.86875C3.14375 8.58125 3 8.225 3 7.8C3 7.375 3.14375 7.01875 3.43125 6.73125C3.71875 6.44375 4.075 6.3 4.5 6.3H9C9.825 6.3 10.5312 6.59375 11.1187 7.18125C11.7062 7.76875 12 8.475 12 9.3V9.3H4.5V9.3M7.5 22.8C8.75 22.8 9.8125 22.3625 10.6875 21.4875C11.5625 20.6125 12 19.55 12 18.3C12 17.05 11.5625 15.9875 10.6875 15.1125C9.8125 14.2375 8.75 13.8 7.5 13.8C6.25 13.8 5.1875 14.2375 4.3125 15.1125C3.4375 15.9875 3 17.05 3 18.3C3 19.55 3.4375 20.6125 4.3125 21.4875C5.1875 22.3625 6.25 22.8 7.5 22.8V22.8M27.75 22.8C28.375 22.8 28.9062 22.5812 29.3438 22.1437C29.7812 21.7062 30 21.175 30 20.55C30 19.925 29.7812 19.3937 29.3438 18.9562C28.9062 18.5187 28.375 18.3 27.75 18.3C27.125 18.3 26.5938 18.5187 26.1562 18.9562C25.7188 19.3937 25.5 19.925 25.5 20.55C25.5 21.175 25.7188 21.7062 26.1562 22.1437C26.5938 22.5812 27.125 22.8 27.75 22.8V22.8M7.5 20.55C6.875 20.55 6.34375 20.3312 5.90625 19.8937C5.46875 19.4562 5.25 18.925 5.25 18.3C5.25 17.675 5.46875 17.1437 5.90625 16.7062C6.34375 16.2687 6.875 16.05 7.5 16.05C8.125 16.05 8.65625 16.2687 9.09375 16.7062C9.53125 17.1437 9.75 17.675 9.75 18.3C9.75 18.925 9.53125 19.4562 9.09375 19.8937C8.65625 20.3312 8.125 20.55 7.5 20.55V20.55M28.5 15.3375C29.15 15.4625 29.6875 15.6312 30.1125 15.8438C30.5375 16.0563 31 16.4 31.5 16.875V7.8C31.5 6.975 31.2062 6.26875 30.6187 5.68125C30.0312 5.09375 29.325 4.8 28.5 4.8H19.05L17.475 3.15L19.575 1.05L18.525 0L13.2 5.325L14.325 6.375L16.425 4.275L18 5.85V9.3C18 10.125 17.7062 10.8312 17.1187 11.4187C16.5312 12.0062 15.825 12.3 15 12.3H11.9625C12.5375 12.725 13 13.1625 13.35 13.6125C13.7 14.0625 14.05 14.625 14.4 15.3H15C16.65 15.3 18.0625 14.7125 19.2375 13.5375C20.4125 12.3625 21 10.95 21 9.3V7.8H28.5V7.8V7.8V15.3375V15.3375M22.5375 19.8C22.6875 19.125 22.8687 18.5813 23.0812 18.1688C23.2937 17.7563 23.625 17.3 24.075 16.8H14.85C14.95 17.375 15 17.875 15 18.3C15 18.725 14.95 19.225 14.85 19.8H22.5375V19.8M27.75 25.8C26.3 25.8 25.0625 25.2875 24.0375 24.2625C23.0125 23.2375 22.5 22 22.5 20.55C22.5 19.1 23.0125 17.8625 24.0375 16.8375C25.0625 15.8125 26.3 15.3 27.75 15.3C29.2 15.3 30.4375 15.8125 31.4625 16.8375C32.4875 17.8625 33 19.1 33 20.55C33 22 32.4875 23.2375 31.4625 24.2625C30.4375 25.2875 29.2 25.8 27.75 25.8V25.8M7.5 25.8C5.425 25.8 3.65625 25.0688 2.19375 23.6063C0.73125 22.1438 0 20.375 0 18.3C0 16.225 0.73125 14.4562 2.19375 12.9937C3.65625 11.5312 5.425 10.8 7.5 10.8C9.575 10.8 11.3437 11.5312 12.8062 12.9937C14.2687 14.4562 15 16.225 15 18.3C15 20.375 14.2687 22.1438 12.8062 23.6063C11.3437 25.0688 9.575 25.8 7.5 25.8V25.8M22.2375 12.3V12.3V12.3V12.3V12.3V12.3V12.3V12.3V12.3V12.3V12.3V12.3V12.3V12.3V12.3"
                  fill="#216586"
                />
              </svg>
            }
            impactIcon={
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.4 14.5923C1.65 13.8423 1.0625 12.9756 0.6375 11.9923C0.2125 11.009 0 9.99231 0 8.94231C0 7.89231 0.2 6.85481 0.6 5.82981C1 4.80481 1.65 3.84231 2.55 2.94231C3.13333 2.35897 3.85417 1.85897 4.7125 1.44231C5.57083 1.02564 6.5875 0.696474 7.7625 0.454808C8.9375 0.213141 10.2792 0.0673077 11.7875 0.0173077C13.2958 -0.0326923 14.9833 0.025641 16.85 0.192308C16.9833 1.95897 17.025 3.58397 16.975 5.06731C16.925 6.55064 16.7875 7.88814 16.5625 9.07981C16.3375 10.2715 16.0208 11.3131 15.6125 12.2048C15.2042 13.0965 14.7 13.8423 14.1 14.4423C13.2167 15.3256 12.2792 15.9715 11.2875 16.3798C10.2958 16.7881 9.28333 16.9923 8.25 16.9923C7.16667 16.9923 6.10833 16.7798 5.075 16.3548C4.04167 15.9298 3.15 15.3423 2.4 14.5923ZM5.2 14.1923C5.68333 14.4756 6.17917 14.6798 6.6875 14.8048C7.19583 14.9298 7.71667 14.9923 8.25 14.9923C9.01667 14.9923 9.775 14.8381 10.525 14.5298C11.275 14.2215 11.9917 13.7256 12.675 13.0423C12.975 12.7423 13.2792 12.3215 13.5875 11.7798C13.8958 11.2381 14.1625 10.5298 14.3875 9.65481C14.6125 8.77981 14.7833 7.72147 14.9 6.47981C15.0167 5.23814 15.0333 3.75897 14.95 2.04231C14.1333 2.00897 13.2125 1.99647 12.1875 2.00481C11.1625 2.01314 10.1417 2.09231 9.125 2.24231C8.10833 2.39231 7.14167 2.63397 6.225 2.96731C5.30833 3.30064 4.55833 3.75897 3.975 4.34231C3.225 5.09231 2.70833 5.83397 2.425 6.56731C2.14167 7.30064 2 8.00897 2 8.69231C2 9.67564 2.1875 10.5381 2.5625 11.2798C2.9375 12.0215 3.26667 12.5423 3.55 12.8423C4.25 11.509 5.175 10.2298 6.325 9.00481C7.475 7.77981 8.81667 6.77564 10.35 5.99231C9.15 7.04231 8.10417 8.22981 7.2125 9.55481C6.32083 10.8798 5.65 12.4256 5.2 14.1923Z"
                  fill="#006E0F"
                />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}

function TransparencySection({ t }) {
  return (
    <section className={styles.transparency}>
      <div className={styles.container}>
        <div className={styles.images}>
          <div className={styles.image}>
            <img
              src={transparency_img1}
              alt=""
              aria-label="laoding"
            />
          </div>
          <div className={styles.image}>
            <img
              src={transparency_img5}
              alt=""
              aria-label="laoding"
            />
          </div>
          <div className={styles.image}>
            <img
              src={transparency_img3}
              alt=""
              aria-label="laoding"
            />
          </div>
          <div className={styles.image}>
            <img
              src={transparency_img4}
              alt=""
              aria-label="laoding"
            />
          </div>
        </div>

        <div className={styles.details}>
          <h2>
            {t("transparencySection.title")} <br />
            {t("transparencySection.titleLine2")}
          </h2>

          <p>{t("transparencySection.description")}</p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <h1>{t("transparencySection.stats.schools.number")}</h1>
              <div className={styles.description}>
                <h3>{t("transparencySection.stats.schools.title")}</h3>
                <p>{t("transparencySection.stats.schools.description")}</p>
              </div>
            </div>

            <div className={styles.stat}>
              <h1>{t("transparencySection.stats.patients.number")}</h1>
              <div className={styles.description}>
                <h3>{t("transparencySection.stats.patients.title")}</h3>
                <p>{t("transparencySection.stats.patients.description")}</p>
              </div>
            </div>

            <div className={styles.stat}>
              <h1>{t("transparencySection.stats.farms.number")}</h1>
              <div className={styles.description}>
                <h3>{t("transparencySection.stats.farms.title")}</h3>
                <p>{t("transparencySection.stats.farms.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function DonationFromSection({ t, i18n }) {
  const dispatch = useDispatch();
  const dataForSelect = useSelector(
    (state) => state.projects.projectsForSelect,
  );
  console.log(dataForSelect);

  const params = new URLSearchParams(window.location.search);
  const project_id = params.get("project_id");
  const lang = i18n.language;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    dispatch(fetchProjectsForSelect({ lang }));
  }, [dispatch, lang]);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    amount: "",
    project: project_id || "",
    receipt: null,
    message: "",
  });

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    amount: "",
    project: "",
    receipt: "",
    message: "",
  });

  const [touched, setTouched] = useState({
    fullname: false,
    email: false,
    amount: false,
    project: false,
    receipt: false,
    message: false,
  });

  useEffect(() => {
    setErrors({
      fullname: "",
      email: "",
      amount: "",
      project: "",
      receipt: "",
      message: "",
    });

    setTouched({
      fullname: false,
      email: false,
      amount: false,
      project: false,
      receipt: false,
      message: false,
    });
  }, [lang]);

  // Validation functions using translations
  const validateFullname = (name) => {
    if (!name || name.trim() === "") {
      return t("donationForm.validation.fullname.required");
    }
    if (name.trim().length < 2) {
      return t("donationForm.validation.fullname.minLength");
    }
    if (name.trim().length > 100) {
      return t("donationForm.validation.fullname.maxLength");
    }
    if (
      !/^[a-zA-Z\s\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/.test(
        name.trim(),
      )
    ) {
      return t("donationForm.validation.fullname.invalid");
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === "") {
      return t("donationForm.validation.email.required");
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return t("donationForm.validation.email.invalid");
    }
    if (email.length > 255) {
      return t("donationForm.validation.email.maxLength");
    }
    return "";
  };

  const validateAmount = (amount) => {
    if (!amount || amount === "") {
      return "";
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      return t("donationForm.validation.amount.invalidNumber");
    }
    if (amountNum <= 0) {
      return t("donationForm.validation.amount.greaterThanZero");
    }
    if (amountNum > 1000000) {
      return t("donationForm.validation.amount.maxValue");
    }
    if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
      return t("donationForm.validation.amount.maxDecimals");
    }
    return "";
  };

  const validateProject = (project) => {
    // if (!project || project === "") {
    //   return t("donationForm.validation.project.required");
    // }
    // if (project === "none") {
    //   return t("donationForm.validation.project.invalid");
    // }
    return "";
  };

  const validateReceipt = (receipt) => {
    if (!receipt) {
      return t("donationForm.validation.receipt.required");
    }
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(receipt.type)) {
      return t("donationForm.validation.receipt.invalidType");
    }
    const maxSize = 5 * 1024 * 1024;
    if (receipt.size > maxSize) {
      return t("donationForm.validation.receipt.maxSize");
    }
    return "";
  };
  const validateMessage = (message) => {
    if (message && message.length > 1000) {
      return t("donationForm.validation.message.maxLength");
    }
    return "";
  };

  const validateField = (name, value) => {
    switch (name) {
      case "fullname":
        return validateFullname(value);
      case "email":
        return validateEmail(value);
      case "amount":
        return validateAmount(value);
      case "project":
        return validateProject(value);
      case "receipt":
        return validateReceipt(value);
      case "message":
        return validateMessage(value);
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullname: validateFullname(formData.fullname),
      email: validateEmail(formData.email),
      amount: validateAmount(formData.amount),
      project: validateProject(formData.project),
      receipt: validateReceipt(formData.receipt),
      message: validateMessage(formData.message),
    };

    setErrors(newErrors);

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(touched).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleInputChange = (e) => {
    const { value, name, type, files } = e.target;
    const newValue = type === "file" ? files[0] : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError("");
    }

    if (submitSuccess) {
      setSubmitSuccess(false);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleReceiptBlur = () => {
    setTouched((prev) => ({ ...prev, receipt: true }));
    const error = validateReceipt(formData.receipt);
    setErrors((prev) => ({
      ...prev,
      receipt: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");
    setSubmitSuccess(false);

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("nom_complet", formData.fullname.trim());
      submitData.append("email", formData.email.trim());
      submitData.append(
        "montant",
        formData.amount ? parseFloat(formData.amount) : 0,
      );
      
      const typeDest = formData.project && formData.project !== "none" ? "specifique" : "general";
      submitData.append("type_destination", typeDest);
      if (typeDest === "specifique") {
        submitData.append("projet_id", formData.project);
      }

      submitData.append("message", formData.message || "");
      
      // Honeypot field
      submitData.append("website", "");

      if (formData.receipt) {
        submitData.append("receipt", formData.receipt);
      }

      const API_URL = import.meta.env.VITE_BASE_BACK_END_URL || "http://localhost:5000";

      // Fetch CSRF token
      const csrfRes = await axios.get(`${API_URL}/api/dons/financier/csrf-token`, {
        withCredentials: true,
      });
      const csrfToken = csrfRes.data.csrfToken;

      const response = await axios.post(`${API_URL}/api/dons/financier`, submitData, {
        withCredentials: true,
        headers: {
          "x-csrf-token": csrfToken,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        setFormData({
          fullname: "",
          email: "",
          amount: "",
          project: project_id || "",
          receipt: null,
          message: "",
        });

        // Reset touched states
        setTouched({
          fullname: false,
          email: false,
          amount: false,
          project: false,
          receipt: false,
          message: false,
        });

        const fileInput = document.getElementById("receipt");
        if (fileInput) fileInput.value = "";

        // Auto hide success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
         throw new Error("Erreur serveur lors de la soumission");
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg = error.response?.data?.message || error.message || t("donationForm.errors.submissionFailed");
      setSubmitError(errorMsg);

      // Auto hide error message after 5 seconds
      setTimeout(() => {
        setSubmitError("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.donationForm}>
      <h1 className={styles.title}>{t("donationForm.title")}</h1>
      <p className={styles.subtitle}>{t("donationForm.subtitle")}</p>

      {submitSuccess && (
        <div className={styles.successMessage}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
              fill="white"
            />
          </svg>
          <span>{t("donationForm.successMessage")}</span>
        </div>
      )}

      {submitError && (
        <div className={styles.errorMessage}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
              fill="white"
            />
          </svg>
          <span>{submitError}</span>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.number}>1</div>
            <div className={styles.content}>
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  fill="#000000"
                  height="50px"
                  width="50px"
                  version="1.1"
                  id="Layer_1"
                  viewBox="0 0 300.346 300.346"
                  xmlSpace="preserve"
                >
                  <g>
                    <g>
                      <g>
                        <path d="M296.725,153.904c-3.612-5.821-9.552-9.841-16.298-11.03c-6.753-1.189-13.704,0.559-19.14,4.835l-21.379,17.125     c-3.533-3.749-8.209-6.31-13.359-7.218c-6.746-1.189-13.703,0.559-19.1,4.805l-12.552,9.921h-32.236     c-5.152,0-10.302-1.238-14.892-3.579l-11.486-5.861c-9.678-4.937-20.537-7.327-31.385-6.908     c-15.046,0.579-29.449,6.497-40.554,16.666L2.455,229.328c-2.901,2.656-3.28,7.093-0.873,10.203l32.406,41.867     c1.481,1.913,3.714,2.933,5.983,2.933c1.374,0,2.762-0.374,4.003-1.151l38.971-24.37c2.776-1.736,5.974-2.654,9.249-2.654h90.429     c12.842,0,25.445-4.407,35.489-12.409l73.145-58.281C300.817,177.855,303.165,164.286,296.725,153.904z M216.812,174.294     c2.034-1.602,4.561-2.236,7.112-1.787c1.536,0.271,2.924,0.913,4.087,1.856l-12.645,10.129c-1.126-2.111-2.581-4.019-4.282-5.672     L216.812,174.294z M281.838,173.64l-73.147,58.282c-7.377,5.878-16.634,9.116-26.067,9.116H92.194     c-6.113,0-12.084,1.714-17.266,4.954l-33.17,20.743L17.799,235.78l56.755-51.969c8.468-7.753,19.45-12.267,30.924-12.708     c8.271-0.32,16.552,1.504,23.932,5.268l11.486,5.861c6.708,3.422,14.234,5.231,21.763,5.231h32.504     c4.278,0,7.757,3.48,7.757,7.758c0,4.105-3.21,7.507-7.308,7.745l-90.45,5.252c-4.169,0.242-7.352,3.817-7.11,7.985     c0.243,4.168,3.798,7.347,7.986,7.109l90.45-5.252c9.461-0.549,17.317-6.817,20.283-15.321l53.916-43.189     c2.036-1.602,4.566-2.237,7.114-1.787c2.551,0.449,4.708,1.909,6.074,4.111C286.277,165.745,285.402,170.801,281.838,173.64z" />
                        <path d="M148.558,131.669c31.886,0,57.827-25.941,57.827-57.827s-25.941-57.827-57.827-57.827S90.731,41.955,90.731,73.842     S116.672,131.669,148.558,131.669z M148.558,31.135c23.549,0,42.707,19.159,42.707,42.707c0,23.549-19.159,42.707-42.707,42.707     c-23.549,0-42.707-19.159-42.707-42.707C105.851,50.293,125.01,31.135,148.558,31.135z" />
                        <path d="M147.213,87.744c-2.24,0-4.618-0.546-6.698-1.538c-1.283-0.613-2.778-0.65-4.098-0.105     c-1.344,0.554-2.395,1.656-2.884,3.02l-0.204,0.569c-0.87,2.434,0.204,5.131,2.501,6.274c2.129,1.06,4.734,1.826,7.398,2.182     v2.162c0,2.813,2.289,5.101,5.171,5.101c2.814,0,5.102-2.289,5.102-5.101v-2.759c6.712-2.027,11.018-7.542,11.018-14.188     c0-9.156-6.754-13.085-12.625-15.479c-6.355-2.63-6.832-3.78-6.832-5.234c0-1.914,1.664-3.058,4.453-3.058     c2.043,0,3.883,0.366,5.63,1.121c1.273,0.549,2.682,0.553,3.966,0.009c1.28-0.543,2.297-1.599,2.79-2.901l0.204-0.541     c0.97-2.56-0.228-5.41-2.726-6.487c-1.676-0.723-3.51-1.229-5.46-1.508v-1.908c0-2.813-2.289-5.102-5.102-5.102     c-2.813,0-5.101,2.289-5.101,5.102v2.549c-6.511,1.969-10.53,7.12-10.53,13.561c0,8.421,6.76,12.208,13.342,14.789     c5.579,2.262,6.045,4.063,6.045,5.574C152.572,86.724,149.686,87.744,147.213,87.744z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <div className={styles.desc}>
                <h3>{t("donationForm.steps.step1.title")}</h3>
                <p>{t("donationForm.steps.step1.description")}</p>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.number}>2</div>
            <div className={styles.content}>
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  fill="#000000"
                  width="50px"
                  height="50px"
                  viewBox="0 0 60 60"
                  id="Capa_1"
                  version="1.1"
                  xmlSpace="preserve"
                >
                  <g>
                    <path d="M58.057,6.083H47.298l-8.633-4.855c-0.345-0.193-0.77-0.19-1.112,0.009C37.212,1.435,37,1.804,37,2.2v0.883h-8v3H1.943   C0.872,6.083,0,6.955,0,8.026v44.113c0,1.071,0.872,1.943,1.943,1.943H2v4h10v-4h17v3h8v0.716c0,0.396,0.212,0.765,0.554,0.965   c0.173,0.102,0.368,0.152,0.563,0.152c0.189,0,0.379-0.048,0.548-0.143l8.339-4.69H48v4h10v-4h0.057   c1.071,0,1.943-0.872,1.943-1.943V8.026C60,6.955,59.128,6.083,58.057,6.083z M10,56.083H4v-2h6V56.083z M12,52.119v-0.036H2v0.057   L1.943,8.083H29v2H6.346C5.053,10.083,4,11.135,4,12.428v35.309c0,1.293,1.053,2.346,2.346,2.346H14h8h7v2.002L12,52.119z    M22,48.083v-1h4v1H22z M14,38.083v1h-4v-1H14z M14,42.083h-4v-1h4V42.083z M10,44.083h4v1h-4V44.083z M10,47.083h4v1h-4V47.083z    M16,38.083h4v10h-4V38.083z M26,42.083h-4v-1h4V42.083z M22,44.083h4v1h-4V44.083z M26,39.083h-4v-1h4V39.083z M28,37.083   c0-0.553-0.447-1-1-1h-5h-1h-6h-1H9c-0.553,0-1,0.447-1,1v11H6.346C6.155,48.083,6,47.927,6,47.737V31.083h8h8h7v17h-1V37.083z    M29,29.083h-1v-11c0-0.553-0.447-1-1-1h-5h-1h-6h-1H9c-0.553,0-1,0.447-1,1v11H6V12.428c0-0.19,0.155-0.346,0.346-0.346H29V29.083   z M22,29.083v-1h4v1H22z M14,19.083v1h-4v-1H14z M14,23.083h-4v-1h4V23.083z M10,25.083h4v1h-4V25.083z M10,28.083h4v1h-4V28.083z    M16,19.083h4v10h-4V19.083z M26,23.083h-4v-1h4V23.083z M22,25.083h4v1h-4V25.083z M26,20.083h-4v-1h4V20.083z M31,55.083v-1v-4   v-40v-4v-1h6v50H31z M39,3.71l4.219,2.373h-0.147L53,11.668v3.415c-0.553,0-1,0.447-1,1c0,0.553,0.447,1,1,1v1   c-0.553,0-1,0.447-1,1s0.447,1,1,1v20c-0.553,0-1,0.447-1,1s0.447,1,1,1v1c-0.553,0-1,0.447-1,1s0.447,1,1,1v3.332L39,56.29V3.71z    M56,56.083h-6v-2h6V56.083z M58,52.083h-7.294L55,49.668v-0.083v-4.502h1c0.553,0,1-0.447,1-1s-0.447-1-1-1h-1v-1h1   c0.553,0,1-0.447,1-1s-0.447-1-1-1h-1v-20h1c0.553,0,1-0.447,1-1s-0.447-1-1-1h-1v-1h1c0.553,0,1-0.447,1-1c0-0.553-0.447-1-1-1h-1   v-4.585v-0.083l-4.182-2.352L58,8.026l0.057,44.057H58z" />

                    <circle cx="34" cy="6.999" r="1" />

                    <circle cx="34" cy="12.999" r="1" />

                    <circle cx="34" cy="46.999" r="1" />

                    <circle cx="34" cy="40.999" r="1" />

                    <circle cx="34" cy="18.999" r="1" />

                    <circle cx="34" cy="52.999" r="1" />

                    <path d="M41,35c-0.553,0-1,0.447-1,1s0.447,1,1,1c2.212,0,4.011-1.799,4.011-4.011V27.01C45.011,24.798,43.212,23,41,23   c-0.553,0-1,0.447-1,1s0.447,1,1,1c1.108,0,2.011,0.902,2.011,2.011v5.979C43.011,34.097,42.108,35,41,35z" />

                    <path d="M41,19c-0.553,0-1,0.447-1,1s0.447,1,1,1c3.314,0,6.011,2.696,6.011,6.011v5.979C47.011,36.303,44.314,39,41,39   c-0.553,0-1,0.447-1,1s0.447,1,1,1c4.417,0,8.011-3.594,8.011-8.011V27.01C49.011,22.593,45.417,19,41,19z" />
                  </g>
                </svg>
              </div>
              <div className={styles.desc}>
                <h3>{t("donationForm.steps.step2.title")}</h3>
                <p>{t("donationForm.steps.step2.description")}</p>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.number}>3</div>
            <div className={styles.content}>
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50px"
                  height="50px"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M31.5083 13.9475L34.9054 8.98148C31.7645 9.16855 27.9659 9.90622 24.3212 10.9606C21.8446 11.6771 19.0865 11.569 16.5223 11.0959C15.7147 10.9469 14.9191 10.7603 14.1488 10.5481L16.4562 13.945C21.1677 15.6842 26.796 15.685 31.5083 13.9475ZM15.2815 15.6365C20.7022 17.7885 27.275 17.7878 32.695 15.6345C34.8987 17.9207 37.175 20.7657 38.9289 23.7416C40.7625 26.8526 41.9199 29.9295 41.996 32.5723C42.068 35.0734 41.1893 37.2281 38.7141 38.8825C36.091 40.6357 31.5202 41.9244 24.024 41.9969C16.5257 42.0694 11.9479 40.868 9.31733 39.1673C6.84175 37.5668 5.946 35.4353 6.00245 32.9202C6.06213 30.2614 7.20619 27.1403 9.03585 23.9635C10.7825 20.9307 13.0594 18.0103 15.2815 15.6365ZM13.662 8.31949C14.6893 8.64286 15.7776 8.92471 16.8852 9.12906C19.2829 9.57147 21.6987 9.63727 23.7654 9.03939C26.3919 8.27955 29.1492 7.66384 31.733 7.2991C29.5282 6.57325 26.8626 6 24.0433 6C19.9743 6 16.1968 7.19394 13.662 8.31949ZM11.7469 7.01231C14.4518 5.65746 19.0249 4 24.0433 4C28.9687 4 33.4307 5.59663 36.1239 6.93673C36.1692 6.95924 36.2139 6.98167 36.2581 7.00403C36.9838 7.37078 37.5736 7.7157 38 8L33.8956 14C43.3574 23.6727 54.6501 43.701 24.0433 43.9968C-6.56356 44.2926 4.53174 24.0426 14.0758 14L10 8C10.2852 7.81256 10.642 7.59878 11.0622 7.36975C11.2746 7.25402 11.5031 7.13439 11.7469 7.01231Z"
                    fill="#333333"
                  />
                  <path
                    d="M22.2887 21H25.7113V22.6H29.1339V25.8H22.2887L22.1347 25.8128C21.9374 25.8462 21.7589 25.9433 21.6304 26.0872C21.5019 26.231 21.4314 26.4126 21.4314 26.6C21.4314 26.7874 21.5019 26.969 21.6304 27.1128C21.7589 27.2567 21.9374 27.3538 22.1347 27.3872L22.2887 27.4H25.7113L25.9919 27.408C27.1019 27.4737 28.1409 27.9409 28.8887 28.7106C29.6364 29.4803 30.0342 30.492 29.9977 31.5313C29.9612 32.5706 29.4933 33.5557 28.6932 34.2778C27.8929 35.0001 26.8235 35.4026 25.7113 35.4V37H22.2887V35.4H18.8661V32.2H25.7113L25.8653 32.1872C26.0626 32.1538 26.2411 32.0567 26.3696 31.9128C26.4981 31.769 26.5686 31.5874 26.5686 31.4C26.5686 31.2126 26.4981 31.031 26.3696 30.8872C26.2411 30.7433 26.0626 30.6462 25.8653 30.6128L25.7113 30.6H22.2887L22.0081 30.592C20.8981 30.5263 19.8591 30.0591 19.1113 29.2894C18.3636 28.5197 17.9658 27.508 18.0023 26.4687C18.0388 25.4294 18.5067 24.4443 19.3068 23.7222C20.1071 22.9999 21.1765 22.5974 22.2887 22.6V21Z"
                    fill="#333333"
                  />
                </svg>
              </div>
              <div className={styles.desc}>
                <h3>{t("donationForm.steps.step3.title")}</h3>
                <p>{t("donationForm.steps.step3.description")}</p>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.number}>4</div>
            <div className={styles.content}>
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50px"
                  height="50px"
                  viewBox="0 0 1024 1024"
                  fill="#000000"
                  className="icon"
                  version="1.1"
                >
                  <path
                    d="M775.942 959.906H56.09a7.994 7.994 0 0 1-7.998-7.998V72.09a7.994 7.994 0 0 1 7.998-7.998H104.08c4.42 0 7.998 3.578 7.998 7.998s-3.578 8-7.998 8H64.09v863.82h703.854V80.09h-39.992c-4.42 0-7.998-3.578-7.998-8s3.578-7.998 7.998-7.998h47.99a7.994 7.994 0 0 1 7.998 7.998v879.818a7.992 7.992 0 0 1-7.998 7.998z"
                    fill=""
                  />
                  <path
                    d="M663.964 80.09h-47.99c-4.422 0-7.998-3.578-7.998-8s3.576-7.998 7.998-7.998h47.99c4.42 0 7.998 3.578 7.998 7.998s-3.578 8-7.998 8zM551.988 80.09h-47.99c-4.42 0-7.998-3.578-7.998-8s3.578-7.998 7.998-7.998h47.99c4.42 0 7.998 3.578 7.998 7.998s-3.578 8-7.998 8zM440.012 80.09h-47.99c-4.422 0-7.998-3.578-7.998-8s3.576-7.998 7.998-7.998h47.99c4.42 0 7.998 3.578 7.998 7.998s-3.578 8-7.998 8zM328.036 80.09h-47.99c-4.422 0-8-3.578-8-8s3.578-7.998 8-7.998h47.99c4.42 0 7.998 3.578 7.998 7.998s-3.578 8-7.998 8zM216.058 80.09H168.068c-4.422 0-8-3.578-8-8s3.578-7.998 8-7.998h47.99a7.998 7.998 0 1 1 0 15.998zM767.944 991.9H56.09a7.994 7.994 0 0 1-7.998-7.998 7.994 7.994 0 0 1 7.998-7.998h711.852a7.992 7.992 0 0 1 7.998 7.998 7.99 7.99 0 0 1-7.996 7.998zM767.944 1023.894H56.09a7.994 7.994 0 0 1-7.998-8 7.994 7.994 0 0 1 7.998-7.998h711.852a7.994 7.994 0 0 1 7.998 7.998 7.99 7.99 0 0 1-7.996 8z"
                    fill=""
                  />
                  <path
                    d="M136.074 144.076c-13.232 0-23.996-10.764-23.996-23.996V24.1c0-13.232 10.764-23.996 23.996-23.996S160.07 10.868 160.07 24.1v95.98c0 13.232-10.764 23.996-23.996 23.996z m0-127.974a8.008 8.008 0 0 0-7.998 8v95.98c0 4.414 3.592 8 7.998 8a8 8 0 0 0 7.998-8v-95.98a8 8 0 0 0-7.998-8zM248.05 144.076c-13.232 0-23.994-10.764-23.994-23.996V24.1c0-13.232 10.762-23.996 23.994-23.996s23.996 10.764 23.996 23.996v95.98c0 13.232-10.762 23.996-23.996 23.996z m0-127.974a8.008 8.008 0 0 0-7.998 8v95.98c0 4.414 3.594 8 7.998 8a8 8 0 0 0 7.998-8v-95.98a8 8 0 0 0-7.998-8zM360.028 144.076c-13.23 0-23.994-10.764-23.994-23.996V24.1c0-13.232 10.764-23.996 23.994-23.996 13.232 0 23.996 10.764 23.996 23.996v95.98c0 13.232-10.764 23.996-23.996 23.996z m0-127.974a8.008 8.008 0 0 0-7.998 8v95.98c0 4.414 3.594 8 7.998 8a8 8 0 0 0 8-8v-95.98a8 8 0 0 0-8-8zM472.004 144.076c-13.232 0-23.996-10.764-23.996-23.996V24.1c0-13.232 10.764-23.996 23.996-23.996S496 10.87 496 24.102v95.98c0 13.23-10.764 23.994-23.996 23.994z m0-127.974c-4.406 0-8 3.584-8 8v95.98c0 4.414 3.594 8 8 8a8 8 0 0 0 7.998-8v-95.98a8 8 0 0 0-7.998-8zM583.982 144.076c-13.232 0-23.996-10.764-23.996-23.996V24.1c0-13.232 10.764-23.996 23.996-23.996 13.23 0 23.994 10.764 23.994 23.996v95.98c0 13.232-10.764 23.996-23.994 23.996z m0-127.974c-4.406 0-8 3.584-8 8v95.98c0 4.414 3.594 8 8 8a8 8 0 0 0 7.998-8v-95.98a8 8 0 0 0-7.998-8zM695.958 144.076c-13.232 0-23.996-10.764-23.996-23.996V24.1c0-13.232 10.764-23.996 23.996-23.996 13.23 0 23.994 10.764 23.994 23.996v95.98c0.002 13.232-10.762 23.996-23.994 23.996z m0-127.974c-4.406 0-8 3.584-8 8v95.98c0 4.414 3.594 8 8 8a8 8 0 0 0 7.998-8v-95.98a8 8 0 0 0-7.998-8zM919.928 911.918a8.004 8.004 0 0 1-6.672-3.562l-31.992-47.99a8.024 8.024 0 0 1-0.922-6.966l15.574-46.756v-14.702a7.994 7.994 0 0 1 8-7.998 7.994 7.994 0 0 1 7.998 7.998v15.996c0 0.86-0.14 1.718-0.406 2.532l-14.764 44.274 29.822 44.74a7.986 7.986 0 0 1-2.216 11.092 7.988 7.988 0 0 1-4.422 1.342z"
                    fill=""
                  />
                  <path
                    d="M919.912 911.918a8 8 0 0 1-6.656-12.436l29.824-44.74-14.748-44.274a7.732 7.732 0 0 1-0.422-2.532v-15.996a7.994 7.994 0 0 1 7.998-7.998 7.994 7.994 0 0 1 7.998 7.998v14.702l15.592 46.756a7.976 7.976 0 0 1-0.938 6.966l-31.994 47.99a7.966 7.966 0 0 1-6.654 3.564zM951.904 671.966h-63.986a7.994 7.994 0 0 1-7.998-7.998c0-4.422 3.578-8 7.998-8h63.986c4.422 0 8 3.578 8 8a7.994 7.994 0 0 1-8 7.998z"
                    fill=""
                  />
                  <path
                    d="M887.918 671.966a8 8 0 0 1-7.982-7.686l-15.996-399.926a7.98 7.98 0 0 1 7.67-8.31c4.374-0.554 8.124 3.258 8.31 7.67l15.996 399.942a8.016 8.016 0 0 1-7.67 8.31h-0.328zM951.92 671.966h-0.328c-4.42-0.188-7.858-3.906-7.67-8.31l15.998-399.942c0.172-4.412 3.874-8.216 8.31-7.67a8.002 8.002 0 0 1 7.67 8.31l-15.996 399.926a8 8 0 0 1-7.984 7.686z"
                    fill=""
                  />
                  <path
                    d="M967.902 272.034a7.992 7.992 0 0 1-7.998-7.998c0-37.148-13.452-55.988-39.992-55.988-26.526 0-39.992 18.84-39.992 55.988 0 4.422-3.578 7.998-7.998 7.998s-7.998-3.576-7.998-7.998c0-45.748 20.418-71.984 55.988-71.984 35.586 0 55.988 26.236 55.988 71.984a7.994 7.994 0 0 1-7.998 7.998z"
                    fill=""
                  />
                  <path
                    d="M935.908 208.046h-31.992c-4.422 0-8-3.578-8-7.998s3.578-7.998 8-7.998h31.992c4.422 0 7.998 3.578 7.998 7.998s-3.576 7.998-7.998 7.998zM919.912 479.99a7.992 7.992 0 0 1-7.998-7.998V232.042c0-4.42 3.576-7.998 7.998-7.998s7.998 3.578 7.998 7.998v239.95a7.992 7.992 0 0 1-7.998 7.998zM951.904 703.96h-63.986a7.994 7.994 0 0 1-7.998-8 7.994 7.994 0 0 1 7.998-7.998h63.986c4.422 0 8 3.578 8 7.998 0 4.422-3.578 8-8 8z"
                    fill=""
                  />
                  <path
                    d="M951.904 703.96a7.994 7.994 0 0 1-7.998-8v-31.992c0-4.422 3.578-8 7.998-8 4.422 0 8 3.578 8 8v31.992c0 4.422-3.578 8-8 8zM887.918 703.96a7.994 7.994 0 0 1-7.998-8v-31.992c0-4.422 3.578-8 7.998-8a7.994 7.994 0 0 1 7.998 8v31.992c0 4.422-3.576 8-7.998 8zM951.904 799.94h-63.986a7.994 7.994 0 0 1-7.998-7.998 7.994 7.994 0 0 1 7.998-7.998h63.986c4.422 0 8 3.578 8 7.998a7.994 7.994 0 0 1-8 7.998z"
                    fill=""
                  />
                  <path
                    d="M951.904 799.94a7.994 7.994 0 0 1-7.998-7.998v-95.98a7.994 7.994 0 0 1 7.998-7.998c4.422 0 8 3.578 8 7.998v95.98a7.994 7.994 0 0 1-8 7.998zM887.918 799.94a7.994 7.994 0 0 1-7.998-7.998v-95.98a7.994 7.994 0 0 1 7.998-7.998 7.994 7.994 0 0 1 7.998 7.998v95.98a7.992 7.992 0 0 1-7.998 7.998zM200.06 368.03a7.98 7.98 0 0 1-5.654-2.342l-31.994-31.994a7.996 7.996 0 1 1 11.31-11.31l31.994 31.994a7.996 7.996 0 0 1-5.656 13.652z"
                    fill=""
                  />
                  <path
                    d="M200.06 368.03a7.996 7.996 0 0 1-5.654-13.652l63.986-63.988a7.996 7.996 0 1 1 11.31 11.31l-63.986 63.988a7.98 7.98 0 0 1-5.656 2.342z"
                    fill=""
                  />
                  <path
                    d="M200.06 575.986a7.972 7.972 0 0 1-5.654-2.344l-31.994-31.992a7.996 7.996 0 1 1 11.31-11.31l31.994 31.992a7.996 7.996 0 0 1-5.656 13.654z"
                    fill=""
                  />
                  <path
                    d="M200.06 575.986a7.996 7.996 0 0 1-5.654-13.654l63.986-63.97a7.996 7.996 0 1 1 11.31 11.31l-63.986 63.97a7.964 7.964 0 0 1-5.656 2.344z"
                    fill=""
                  />
                  <path
                    d="M663.964 288.046H344.032c-4.42 0-7.998-3.578-7.998-8s3.578-8 7.998-8h319.934c4.42 0 7.998 3.578 7.998 8s-3.58 8-8 8z"
                    fill=""
                  />
                  <path
                    d="M663.964 336.036H344.032c-4.42 0-7.998-3.578-7.998-7.998s3.578-8 7.998-8h319.934c4.42 0 7.998 3.578 7.998 8s-3.58 7.998-8 7.998z"
                    fill=""
                  />
                  <path
                    d="M503.998 384.026h-159.966a7.994 7.994 0 0 1-7.998-8 7.994 7.994 0 0 1 7.998-7.998h159.966a7.994 7.994 0 0 1 7.998 7.998c0 4.424-3.578 8-7.998 8z"
                    fill=""
                  />
                  <path
                    d="M663.964 496.002H344.032c-4.42 0-7.998-3.578-7.998-7.998s3.578-8 7.998-8h319.934c4.42 0 7.998 3.578 7.998 8s-3.58 7.998-8 7.998z"
                    fill=""
                  />
                  <path
                    d="M663.964 543.992H344.032a7.994 7.994 0 0 1-7.998-7.998 7.994 7.994 0 0 1 7.998-7.998h319.934a7.994 7.994 0 0 1 7.998 7.998 7.996 7.996 0 0 1-8 7.998z"
                    fill=""
                  />
                  <path
                    d="M503.998 591.984h-159.966a7.994 7.994 0 0 1-7.998-8 7.994 7.994 0 0 1 7.998-7.998h159.966a7.994 7.994 0 0 1 7.998 7.998c0 4.422-3.578 8-7.998 8z"
                    fill=""
                  />
                  <path
                    d="M200.06 783.944a7.972 7.972 0 0 1-5.654-2.344l-31.994-31.992a7.996 7.996 0 1 1 11.31-11.31l31.994 31.992a7.996 7.996 0 0 1-5.656 13.654z"
                    fill=""
                  />
                  <path
                    d="M200.06 783.944a7.996 7.996 0 0 1-5.654-13.654l63.986-63.986a7.996 7.996 0 1 1 11.31 11.31L205.716 781.6a7.974 7.974 0 0 1-5.656 2.344z"
                    fill=""
                  />
                  <path
                    d="M663.964 703.96H344.032a7.994 7.994 0 0 1-7.998-8 7.994 7.994 0 0 1 7.998-7.998h319.934a7.994 7.994 0 0 1 7.998 7.998 7.998 7.998 0 0 1-8 8z"
                    fill=""
                  />
                  <path
                    d="M663.964 751.95H344.032a7.994 7.994 0 0 1-7.998-7.998 7.994 7.994 0 0 1 7.998-7.998h319.934a7.994 7.994 0 0 1 7.998 7.998 7.996 7.996 0 0 1-8 7.998z"
                    fill=""
                  />
                  <path
                    d="M503.998 799.94h-159.966a7.994 7.994 0 0 1-7.998-7.998 7.994 7.994 0 0 1 7.998-7.998h159.966a7.994 7.994 0 0 1 7.998 7.998 7.994 7.994 0 0 1-7.998 7.998z"
                    fill=""
                  />
                </svg>
              </div>
              <div className={styles.desc}>
                <h3>{t("donationForm.steps.step4.title")}</h3>
                <p>{t("donationForm.steps.step4.description")}</p>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.number}>5</div>
            <div className={styles.content}>
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50px"
                  height="50px"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 13a3.954 3.954 0 0 0 .142 1H9.858A3.954 3.954 0 0 0 10 13zm-3.5-4h3a2.486 2.486 0 0 1 1.945.949 3.992 3.992 0 0 1 .839-.547A3.485 3.485 0 0 0 13.5 8h-3a3.485 3.485 0 0 0-2.784 1.402 3.992 3.992 0 0 1 .84.547A2.486 2.486 0 0 1 10.5 9zM9 4a3 3 0 1 1 3 3 3.003 3.003 0 0 1-3-3zm1 0a2 2 0 1 0 2-2 2.002 2.002 0 0 0-2 2zM4.5 17h3a3.504 3.504 0 0 1 3.5 3.5V23H1v-2.5A3.504 3.504 0 0 1 4.5 17zm0 1A2.503 2.503 0 0 0 2 20.5V22h8v-1.5A2.503 2.503 0 0 0 7.5 18zM6 16a3 3 0 1 1 3-3 3.003 3.003 0 0 1-3 3zm0-1a2 2 0 1 0-2-2 2.002 2.002 0 0 0 2 2zm17 5.5V23H13v-2.5a3.504 3.504 0 0 1 3.5-3.5h3a3.504 3.504 0 0 1 3.5 3.5zm-1 0a2.503 2.503 0 0 0-2.5-2.5h-3a2.503 2.503 0 0 0-2.5 2.5V22h8zM21 13a3 3 0 1 1-3-3 3.003 3.003 0 0 1 3 3zm-1 0a2 2 0 1 0-2 2 2.002 2.002 0 0 0 2-2z" />
                  <path fill="none" d="M0 0h24v24H0z" />
                </svg>
              </div>
              <div className={styles.desc}>
                <h3>{t("donationForm.steps.step5.title")}</h3>
                <p>{t("donationForm.steps.step5.description")}</p>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.number}>6</div>
            <div className={styles.content}>
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  fill="#000000"
                  height="50px"
                  width="50px"
                  version="1.1"
                  id="Layer_1"
                  viewBox="0 0 502 502"
                  xmlSpace="preserve"
                >
                  <g>
                    <g>
                      <g>
                        <path d="M369.472,34.892c-50.836,0-96.358,28.998-118.472,73.064c-22.113-44.066-67.636-73.064-118.472-73.064     C59.452,34.892,0,94.344,0,167.421c0,62.31,57.586,117.659,103.857,162.133L244.24,464.478c1.912,1.754,4.336,2.63,6.76,2.63     c2.432,0,4.862-0.882,6.776-2.646l140.366-134.908C444.414,285.08,502,229.73,502,167.421     C502,94.344,442.548,34.892,369.472,34.892z M42.272,103.072l22.991-22.991c7.41-7.411,17.987-10.705,28.297-8.801l6.345,1.169     l62.981,19.913c0.202,0.064,0.406,0.122,0.612,0.172c6.936,1.717,6.936,3.94,6.936,6.09c0,0.52-0.092,1.47-0.706,1.998     c-0.75,0.644-2.71,1.153-5.965,0.666l-23.974-3.947c-3.427-0.564-6.906,0.692-9.183,3.32s-3.025,6.248-1.976,9.563l0.063,0.201     c0.483,1.53,1.328,2.921,2.463,4.056l57.781,57.781c1.414,1.414,1.414,3.716,0.001,5.129c-1.417,1.416-3.717,1.414-5.132,0     c-0.004-0.004-0.008-0.007-0.012-0.011c-0.004-0.004-0.007-0.009-0.011-0.013l-40.736-40.462     c-3.918-3.892-10.251-3.871-14.142,0.047c-3.893,3.918-3.871,10.25,0.048,14.142l40.705,40.431     c0.003,0.003,0.005,0.005,0.007,0.008l15.64,15.639c0.924,0.924,1.063,2.004,1.063,2.564c0,0.561-0.139,1.641-1.063,2.565     s-2.003,1.062-2.564,1.062c-0.561,0-1.641-0.138-2.564-1.063l-9.636-9.636l-49.602-49.602c-3.906-3.905-10.236-3.905-14.143,0     c-3.905,3.905-3.905,10.237,0,14.143l49.602,49.602l0.011,0.01c1.403,1.415,1.4,3.708-0.01,5.119     c-1.415,1.413-3.716,1.415-5.131,0l-31.909-31.909L96.61,167.281c-3.905-3.905-10.235-3.905-14.143,0     c-3.905,3.905-3.905,10.237,0,14.142l22.742,22.743c0.002,0.002,0.003,0.003,0.005,0.005l0.012,0.012     c0.914,0.922,1.052,1.994,1.052,2.553c0,0.561-0.139,1.64-1.063,2.565c-0.925,0.924-2.004,1.062-2.564,1.062     s-1.64-0.138-2.564-1.063L47.01,156.223c-0.186-0.186-0.379-0.364-0.579-0.534c-0.146-0.125-14.618-12.904-15.237-28.605     C30.864,118.71,34.488,110.856,42.272,103.072z M386.916,311.737l-22.992,22.992c-7.46,7.46-14.983,11.098-22.968,11.098     c-0.313,0-0.628-0.006-0.941-0.017c-15.801-0.562-28.604-15.123-28.708-15.242c-0.17-0.2-0.349-0.393-0.534-0.578l-53.077-53.077     c-0.924-0.924-1.062-2.004-1.062-2.565c0-0.561,0.138-1.64,1.063-2.565c0.927-0.923,2.006-1.061,2.568-1.061     s1.641,0.138,2.564,1.062c0.002,0.002,0.003,0.003,0.005,0.005l22.742,22.742c1.953,1.953,4.512,2.929,7.071,2.929     s5.118-0.977,7.071-2.929c3.905-3.905,3.905-10.237,0-14.142l-22.747-22.748l-31.909-31.909c-1.414-1.415-1.414-3.716-0.001-5.13     c1.414-1.412,3.713-1.415,5.13-0.002l0.001,0.001l49.601,49.602c1.953,1.953,4.512,2.929,7.071,2.929s5.118-0.977,7.071-2.929     c3.905-3.905,3.905-10.237,0-14.142l-49.601-49.602c-0.002-0.002-0.003-0.003-0.005-0.005l-9.632-9.631     c-1.414-1.415-1.414-3.716-0.001-5.13c1.415-1.413,3.716-1.415,5.131,0l15.609,15.609c0.004,0.004,0.009,0.009,0.013,0.013     l39.454,39.728c1.955,1.969,4.524,2.954,7.096,2.954c2.548,0,5.096-0.968,7.047-2.904c3.918-3.892,3.94-10.224,0.049-14.142     l-39.462-39.737c-0.003-0.003-0.007-0.006-0.011-0.01c-0.005-0.005-0.009-0.01-0.014-0.015l-0.012-0.012     c-0.914-0.922-1.052-1.994-1.052-2.553c0-0.562,0.139-1.641,1.063-2.565s2.003-1.062,2.564-1.062     c0.561,0,1.641,0.138,2.564,1.063l57.782,57.782c1.139,1.138,2.534,1.984,4.07,2.468l0.2,0.063     c3.313,1.042,6.931,0.291,9.554-1.985c2.624-2.276,3.879-5.751,3.314-9.178l-3.947-23.976c-0.488-3.254,0.022-5.213,0.666-5.962     c0.527-0.614,1.479-0.706,1.998-0.706c2.149,0,4.373,0,6.09,6.936c0.051,0.206,0.108,0.41,0.172,0.612l19.913,62.978l1.171,6.348     C397.617,293.748,394.327,304.326,386.916,311.737z M415.963,283.982c-0.141-1.39-0.318-2.78-0.574-4.167l-1.155-6.266     c-0.074-0.593-0.203-1.187-0.39-1.776l-20.047-63.4c-4.834-18.962-17.985-21.805-25.422-21.805     c-6.722,0-12.979,2.797-17.169,7.674c-2.727,3.174-5.643,8.41-5.694,16.311l-36.632-36.631c-4.462-4.463-10.396-6.92-16.707-6.92     c-6.311,0-12.245,2.458-16.706,6.92c-0.875,0.875-1.673,1.806-2.391,2.785c-9.265-8.355-23.602-8.071-32.521,0.849     c-6.867,6.868-8.615,16.945-5.243,25.447c-1.564,0.955-3.041,2.109-4.393,3.46c-9.211,9.212-9.211,24.201,0,33.414l15.396,15.396     c-0.97,0.712-1.892,1.503-2.758,2.37c-4.464,4.462-6.921,10.396-6.921,16.707c0,6.312,2.457,12.245,6.92,16.708l52.851,52.851     c2.334,2.62,16.745,17.946,36.859,21.275c-35.305,34.432-68.458,65.45-82.279,78.301     c-17.149-15.898-64.264-59.925-111.389-107.05c-6.872-6.872-14.164-13.88-21.883-21.299C74.182,273.29,20,221.213,20,167.421     c0-3.954,0.208-7.86,0.607-11.71c5.229,8.163,10.972,13.533,12.484,14.88l52.852,52.851c4.462,4.463,10.396,6.921,16.707,6.921     c6.311,0,12.245-2.458,16.706-6.92c0.867-0.867,1.659-1.789,2.371-2.759l15.397,15.397c4.605,4.606,10.656,6.909,16.706,6.909     c6.051,0,12.102-2.303,16.708-6.909c1.349-1.348,2.5-2.821,3.453-4.381c2.746,1.093,5.703,1.665,8.747,1.665     c6.312,0,12.245-2.458,16.706-6.92c4.464-4.462,6.922-10.396,6.922-16.708c0-5.9-2.148-11.47-6.074-15.816     c0.975-0.712,1.907-1.507,2.787-2.387c9.211-9.212,9.211-24.201,0-33.413l-36.633-36.633c7.9-0.052,13.138-2.968,16.312-5.694     c4.877-4.189,7.674-10.447,7.674-17.169c0-7.437-2.843-20.587-21.804-25.422l-53.6-16.947c5.704-0.895,11.548-1.363,17.5-1.363     c51.056,0,95.797,34.441,108.803,83.754c1.157,4.391,5.128,7.45,9.669,7.45s8.512-3.059,9.669-7.45     c13.006-49.313,57.747-83.754,108.803-83.754C431.52,54.892,482,105.373,482,167.421     C482,208.546,450.332,248.668,415.963,283.982z" />
                        <path d="M459,156c-5.522,0-10,4.477-10,10c0,9.154-1.53,18.127-4.55,26.668c-1.84,5.208,0.89,10.92,6.097,12.761     c1.102,0.39,2.226,0.575,3.332,0.575c4.119,0,7.978-2.565,9.429-6.67C467.085,188.646,469,177.431,469,166     C469,160.477,464.522,156,459,156z" />
                        <path d="M453.879,146.003c1.105,0,2.23-0.185,3.332-0.574c5.207-1.841,7.937-7.554,6.097-12.761     C449.214,92.792,411.314,66,369,66c-22.505,0-43.76,7.301-61.466,21.115c-4.354,3.397-5.13,9.681-1.733,14.035     c3.398,4.355,9.682,5.13,14.036,1.733C333.995,91.838,350.995,86,369,86c33.854,0,64.176,21.433,75.45,53.333     C445.901,143.438,449.76,146.003,453.879,146.003z" />
                        <path d="M150.988,293.348c-3.951-3.861-10.282-3.786-14.141,0.164c-3.86,3.95-3.786,10.282,0.164,14.141l15.999,15.632     c1.945,1.901,4.467,2.848,6.987,2.848c2.599,0,5.194-1.006,7.153-3.011c3.86-3.95,3.786-10.282-0.164-14.141L150.988,293.348z" />
                        <path d="M177.848,333.571c-3.86,3.951-3.786,10.282,0.164,14.142l68,66.44c1.945,1.9,4.467,2.847,6.987,2.847     c2.599,0,5.194-1.006,7.153-3.011c3.86-3.951,3.786-10.282-0.164-14.142l-68-66.44     C188.037,329.547,181.706,329.621,177.848,333.571z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <div className={styles.desc}>
                <h3>{t("donationForm.steps.step6.title")}</h3>
                <p>{t("donationForm.steps.step6.description")}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <h1>{t("donationForm.form.title")}</h1>
          <p>{t("donationForm.form.description")}</p>

          <div className={styles.inputFields}>
            <div className={styles.doubleWrapper}>
              <div
                className={`${styles.wrapper} ${touched.fullname && errors.fullname ? styles.hasError : ""}`}
              >
                <input
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  placeholder=" "
                  disabled={isSubmitting}
                />
                <label htmlFor="fullname">
                  {t("donationForm.form.labels.fullname")}
                </label>
                {touched.fullname && errors.fullname && (
                  <div className={styles.errorContainer}>
                    <svg
                      className={styles.errorIcon}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        fill="#dc3545"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <path
                        d="M8 4V9M8 11V12"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className={styles.errorText}>{errors.fullname}</span>
                  </div>
                )}
              </div>

              <div
                className={`${styles.wrapper} ${touched.email && errors.email ? styles.hasError : ""}`}
              >
                <input
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  placeholder=" "
                  disabled={isSubmitting}
                />
                <label htmlFor="email">
                  {t("donationForm.form.labels.email")}
                </label>
                {touched.email && errors.email && (
                  <div className={styles.errorContainer}>
                    <svg
                      className={styles.errorIcon}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        fill="#dc3545"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <path
                        d="M8 4V9M8 11V12"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className={styles.errorText}>{errors.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.doubleWrapper}>
              <div
                className={`${styles.wrapper} ${touched.amount && errors.amount ? styles.hasError : ""}`}
              >
                <input
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  placeholder=" "
                  step="0.01"
                  min="0"
                  disabled={isSubmitting}
                />
                <label htmlFor="amount">
                  {t("donationForm.form.labels.amount")}
                </label>
                {touched.amount && errors.amount && (
                  <div className={styles.errorContainer}>
                    <svg
                      className={styles.errorIcon}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        fill="#dc3545"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <path
                        d="M8 4V9M8 11V12"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className={styles.errorText}>{errors.amount}</span>
                  </div>
                )}
              </div>

              <div
                className={`${styles.wrapper} ${touched.project && errors.project ? styles.hasError : ""}`}
              >
                <select
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  id="project"
                  name="project"
                  value={formData.project}
                  disabled={isSubmitting}
                >
                  <option value="" disabled>
                    {t("donationForm.form.labels.project")}
                  </option>
                  <option value="none">
                    {t("donationForm.form.labels.projectNone")}
                  </option>
                  {!dataForSelect?.loading &&
                    dataForSelect?.data.map((item) => (
                      <option value={`${item.id}`} key={item.id}>
                        {item.title}
                      </option>
                    ))}
                </select>
                {touched.project && errors.project && (
                  <div className={styles.errorContainer}>
                    <svg
                      className={styles.errorIcon}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        fill="#dc3545"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <path
                        d="M8 4V9M8 11V12"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className={styles.errorText}>{errors.project}</span>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`${styles.fileWrapper} ${touched.receipt && errors.receipt ? styles.hasError : ""}`}
            >
              <label htmlFor="receipt">
                {t("donationForm.form.labels.receipt")}
              </label>
              <input
                onChange={handleInputChange}
                onBlur={handleReceiptBlur}
                type="file"
                id="receipt"
                name="receipt"
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={isSubmitting}
              />
              <label
                htmlFor="receipt"
                className={errors.receipt ? styles.fileLabelError : ""}
              >
                <svg
                  width="35"
                  height="35"
                  viewBox="0 0 33 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.25 24C5.975 24 4.03125 23.2125 2.41875 21.6375C0.80625 20.0625 0 18.1375 0 15.8625C0 13.9125 0.5875 12.175 1.7625 10.65C2.9375 9.125 4.475 8.15 6.375 7.725C7 5.425 8.25 3.5625 10.125 2.1375C12 0.7125 14.125 0 16.5 0C19.425 0 21.9062 1.01875 23.9438 3.05625C25.9813 5.09375 27 7.575 27 10.5C28.725 10.7 30.1562 11.4437 31.2938 12.7312C32.4313 14.0188 33 15.525 33 17.25C33 19.125 32.3438 20.7188 31.0312 22.0312C29.7188 23.3438 28.125 24 26.25 24H18C17.175 24 16.4688 23.7062 15.8813 23.1187C15.2938 22.5312 15 21.825 15 21V13.275L12.6 15.6L10.5 13.5L16.5 7.5L22.5 13.5L20.4 15.6L18 13.275V21H26.25C27.3 21 28.1875 20.6375 28.9125 19.9125C29.6375 19.1875 30 18.3 30 17.25C30 16.2 29.6375 15.3125 28.9125 14.5875C28.1875 13.8625 27.3 13.5 26.25 13.5H24V10.5C24 8.425 23.2687 6.65625 21.8062 5.19375C20.3438 3.73125 18.575 3 16.5 3C14.425 3 12.6562 3.73125 11.1938 5.19375C9.73125 6.65625 9 8.425 9 10.5H8.25C6.8 10.5 5.5625 11.0125 4.5375 12.0375C3.5125 13.0625 3 14.3 3 15.75C3 17.2 3.5125 18.4375 4.5375 19.4625C5.5625 20.4875 6.8 21 8.25 21H12V24H8.25Z"
                    fill={errors.receipt ? "#dc3545" : "#D5C3B4"}
                  />
                </svg>
                <span
                  dangerouslySetInnerHTML={{
                    __html: t("donationForm.form.receiptHint"),
                  }}
                />
              </label>
              {formData.receipt && !errors.receipt && (
                <div className={styles.fileInfo}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" fill="#28a745" />
                    <path
                      d="M4.5 7L6.5 9L10 5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>
                    {t("donationForm.form.fileSelected", {
                      fileName: formData.receipt.name,
                    })}
                  </span>
                </div>
              )}
              {touched.receipt && errors.receipt && (
                <div className={styles.errorContainer}>
                  <svg
                    className={styles.errorIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      fill="#dc3545"
                      stroke="white"
                      strokeWidth="1"
                    />
                    <path
                      d="M8 4V9M8 11V12"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={styles.errorText}>{errors.receipt}</span>
                </div>
              )}
            </div>

            <div
              className={`${styles.wrapper} ${touched.message && errors.message ? styles.hasError : ""}`}
            >
              <textarea
                onChange={handleInputChange}
                onBlur={handleBlur}
                id="message"
                placeholder=" "
                name="message"
                value={formData.message}
                disabled={isSubmitting}
                rows="3"
              ></textarea>
              <label htmlFor="message">
                {t("donationForm.form.labels.message")}
              </label>
              {touched.message && errors.message && (
                <div className={styles.errorContainer}>
                  <svg
                    className={styles.errorIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      fill="#dc3545"
                      stroke="white"
                      strokeWidth="1"
                    />
                    <path
                      d="M8 4V9M8 11V12"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={styles.errorText}>{errors.message}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("donationForm.form.submittingButton")
                : t("donationForm.form.submitButton")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function DonationPage() {
  const { t, i18n } = useTranslation("donationPage");
  return (
    <div className={styles.donationPage}>
      {/* page hero section */}
      <PageHero title={t("hero.title")} heroImg={mountainImg} />

      {/* current needs section */}
      <CurrentNeeds t={t} />
      {/* donate informations section */}
      <DonateInfosSection t={t} />

      {/* your impact section */}
      <ImpactSection t={t} />

      {/* Transparency section */}

      <TransparencySection t={t} />

      {/* donation form section  */}

      <DonationFromSection t={t} i18n={i18n} />
    </div>
  );
}

export default DonationPage;
