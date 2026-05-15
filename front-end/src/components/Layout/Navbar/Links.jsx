import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Navbar.module.css";
import logo from "../../../assets/images/logo.png";
import { fetchDomains } from "../../../features/domains/domainsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import i18n from "../../../i18n";
import Loader from "../../common/Loader";

// Import icons (you can use any icon library like react-icons, lucide-react, or fontawesome)
import {
  FaUsers,
  FaEnvelope,
  FaProjectDiagram,
  FaCalendarAlt,
  FaHandHoldingHeart,
  FaDonate,
  FaUserPlus,
  FaHandsHelping,
  FaGlobe,
  FaChartLine,
  FaHandshake,
  FaBook,
  FaFileAlt,
} from "react-icons/fa";

import { FaAngleDown, FaXmark } from "react-icons/fa6";

const getIconForSubItem = (id) => {
  const iconMap = {
    aboutUs: <FaUsers />,
    contact: <FaEnvelope />,
    projects: <FaProjectDiagram />,
    events: <FaCalendarAlt />,
    donate: <FaDonate />,
    becomeMember: <FaUserPlus />,
    becomeVolunteer: <FaHandsHelping />,
    reports: <FaChartLine />,
    partners: <FaHandshake />,
    resources: <FaBook />,
    seeMore: <FaGlobe />,
  };

  return iconMap[id] || <FaGlobe />;
};

function NavItem({ item, id, handleDropDown, isOpen, setShowAside }) {
  const { t } = useTranslation("nav");
  const handleClick = () => {
    handleDropDown(id);
  };
  return (
    <li
      key={item.id}
      className={`${styles.navItem} ${item.subItems?.length > 0 ? styles.hasDropDown : ""} ${isOpen ? styles.open : ""}`}
    >
      {item.to ? (
        <Link to={item.to} className={styles.navLink} onClick={handleClick}>
          <span>{item.title}</span>
          <FaAngleDown />
        </Link>
      ) : (
        <span className={styles.navLink} onClick={handleClick}>
          <span>{item.title}</span>
          <FaAngleDown />
        </span>
      )}
      {item.subItems?.length > 0 && (
        <div
          className={`${styles.dropdownMenuContainer}`}
          style={{ "--sub-items": item.subItems.length }}
        >
          <div className={styles.dropdownWrapper}>
            <ul className={styles.dropdownMenu}>
              {item.subItems.map((subItem) => (
                <>
                  <li key={subItem.path} className={styles.dropdownItem}>
                    <Link
                      to={subItem.path}
                      className={styles.dropdownLink}
                      onClick={() => setShowAside(false)}
                    >
                      <div className={styles.iconWrapper}>
                        {getIconForSubItem(subItem.id)}
                      </div>
                      <div className={styles.content}>
                        <h3 className={styles.dropdownTitle}>
                          {subItem.label}
                        </h3>
                        <p className={styles.dropdownDescription}>
                          {subItem.description || t(`nav.descriptions.${subItem.id}`)}
                        </p>
                      </div>
                    </Link>
                  </li>
                  <div className={styles.devider}></div>
                </>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

export default function Links({ setShowAside }) {
  const { t } = useTranslation("nav");
  const dispatch = useDispatch();
  const { data: domains, status } = useSelector((state) => state.domains);

  useEffect(() => {
    const lang = i18n.resolvedLanguage || "fr";
    dispatch(fetchDomains(lang));
  }, [dispatch, i18n.language]);

  const menuData = [
    {
      id: "a-propos",
      title: t("nav.about"),
      to: null,
      subItems: [
        {
          id: "aboutUs",
          label: t("nav.dropdown.about.us"),
          path: `/${i18n.language}/nous`,
        },
        {
          id: "contact",
          label: t("nav.dropdown.about.contact"),
          path: `/${i18n.language}/contact`,
        },
      ],
    },
    {
      id: "activites",
      title: t("nav.activities"),
      to: null,
      subItems: [
        {
          id: "projects",
          label: t("nav.dropdown.activities.projects"),
          path: `/${i18n.language}/projets`,
        },
        {
          id: "events",
          label: t("nav.dropdown.activities.events"),
          path: `/${i18n.language}/evenements`,
        },
      ],
    },
    {
      id: "participez",
      title: t("nav.getInvolved"),
      to: `/${i18n.language}/join-us`,
      subItems: [
        {
          id: "donate",
          label: t("nav.dropdown.getInvolved.donate"),
          path: `/${i18n.language}/donate`,
        },
        {
          id: "becomeMember",
          label: t("nav.dropdown.getInvolved.becomeMember"),
          path: `/${i18n.language}/join-us/member`,
        },
        {
          id: "becomeVolunteer",
          label: t("nav.dropdown.getInvolved.becomeVolunteer"),
          path: `/${i18n.language}/join-us/volunteer`,
        },
      ],
    },
    {
      id: "domaines",
      title: t("nav.domains"),
      to: `/${i18n.language}/domains`,
      subItems: (() => {
        if (!domains?.length) return [];

        const limitedDomains = domains.slice(0, 3).map((domain) => ({
          id: "seeMore", // Use seeMore as a generic id for icon/desc if needed, or specific domain id
          label: domain.label,
          path: `/${i18n.language}/domains/${domain.id}`,
          description: domain.description || t("nav.descriptions.seeMore"),
        }));

        if (domains.length > 3) {
          limitedDomains.push({
            id: "seeMore",
            label: t("nav.seeMore"),
            path: `/${i18n.language}/domains`,
          });
        }

        return limitedDomains;
      })(),
    },
    {
      id: "ressources",
      title: t("nav.resources"),
      to: null,
      subItems: [
        {
          id: "reports",
          label: t("nav.dropdown.resources.reports"),
          path: `/${i18n.language}/rapports`,
        },
        {
          id: "partners",
          label: t("nav.dropdown.resources.partners"),
          path: `/${i18n.language}/partenaires`,
        },
      ],
    },
  ];

  const [dropDownsOpen, setDropdownsOpen] = useState(
    Array(menuData.length || 0).fill(false),
  );

  const handleDropDown = (id) => {
    setDropdownsOpen((prev) =>
      prev.map((isOpen, index) => (index === id ? !isOpen : false)),
    );
  };

  if (status == "pending") return <Loader />;

  return (
    <nav className={styles.nav}>
      <div className={styles.associationLogo}>
        <img src={logo} alt="association logo" />
        <div className={styles.exitSideBar} onClick={() => setShowAside(false)}>
          <FaXmark />
        </div>
      </div>
      <ul className={styles.navList}>
        {menuData.map((item, id) => (
          <NavItem
            item={item}
            key={item.id}
            handleDropDown={handleDropDown}
            isOpen={dropDownsOpen[id]}
            id={id}
            setShowAside={setShowAside}
          />
        ))}
      </ul>
    </nav>
  );
}
