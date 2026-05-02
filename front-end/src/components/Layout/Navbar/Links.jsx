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

const getIconForSubItem = (label) => {
  const iconMap = {
    "About Us": <FaUsers />,
    Contact: <FaEnvelope />,
    Projects: <FaProjectDiagram />,
    Events: <FaCalendarAlt />,
    Donate: <FaDonate />,
    "Become a member": <FaUserPlus />,
    "Become a volunteer": <FaHandsHelping />,
    Reports: <FaChartLine />,
    Partners: <FaHandshake />,
    Resources: <FaBook />,
    "See more": <FaGlobe />,
  };

  return iconMap[label] || <FaGlobe />;
};

const getDescription = (label) => {
  const descriptions = {
    "About Us": "Learn more about our mission and values",
    Contact: "Get in touch with our team",
    Projects: "Discover our ongoing initiatives",
    Events: "Join our upcoming gatherings",
    Donate: "Support our cause financially",
    "Become a member": "Join our community of changemakers",
    "Become a volunteer": "Share your time and skills",
    Reports: "View our annual reports and publications",
    Partners: "Meet our collaborators and sponsors",
    Resources: "Access our knowledge base",
    "See more": "Explore all our domains",
  };

  return descriptions[label] || "Learn more about this topic";
};

function NavItem({ item, id, handleDropDown, isOpen, setShowAside }) {
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
                          {subItem.description || getDescription(subItem.label)}
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
          id: "About Us",
          label: t("nav.dropdown.about.us"),
          path: `/${i18n.language}/nous`,
          description: "Discover our story and team",
        },
        {
          id: "Contact",
          label: t("nav.dropdown.about.contact"),
          path: `/${i18n.language}/contact`,
          description: "Reach out to us anytime",
        },
      ],
    },
    {
      id: "activites",
      title: t("nav.activities"),
      to: null,
      subItems: [
        {
          id: "Projects",
          label: t("nav.dropdown.activities.projects"),
          path: `/${i18n.language}/projets`,
          description: "Explore our impactful work",
        },
        {
          id: "Events",
          label: t("nav.dropdown.activities.events"),
          path: `/${i18n.language}/evenements`,
          description: "Calendar of upcoming activities",
        },
      ],
    },
    {
      id: "participez",
      title: t("nav.getInvolved"),
      to: `/${i18n.language}/join-us`,
      subItems: [
        {
          id: "Donate",
          label: t("nav.dropdown.getInvolved.donate"),
          path: `/${i18n.language}/Faire-un-don`,
          description: "Make a difference today",
        },
        {
          id: "Become a member",
          label: t("nav.dropdown.getInvolved.becomeMember"),
          path: `/${i18n.language}/join-us/member`,
          description: "Join our membership program",
        },
        {
          id: "Become a volunteer",
          label: t("nav.dropdown.getInvolved.becomeVolunteer"),
          path: `/${i18n.language}/join-us/volunteer`,
          description: "Contribute your time and talents",
        },
      ],
    },
    {
      id: "domaines",
      title: t("nav.domains"),
      to: `${i18n.language}/domains`,
      subItems: (() => {
        if (!domains?.length) return [];

        const limitedDomains = domains.slice(0, 3).map((domain) => ({
          label: domain.label,
          path: `/${i18n.language}/domains/${domain.id}`,
          description: domain.description || "Explore this domain",
        }));

        if (domains.length > 3) {
          limitedDomains.push({
            id: "See more",
            label: t("nav.seeMore"),
            path: `/${i18n.language}/domains`,
            description: "View all our focus areas",
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
          id: "Reports",
          label: t("nav.dropdown.resources.reports"),
          path: `/${i18n.language}/rapports`,
          description: "Annual reports and studies",
        },
        {
          id: "Partners",
          label: t("nav.dropdown.resources.partners"),
          path: `/${i18n.language}/partenaires`,
          description: "Our network of collaborators",
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
