import styles from "./event-page.module.css";
import heroImg from "../../../assets/images/projects_hero.jpg";
import PageHero from "../../../components/common/PageHero";
import locationIcon from "../../../assets/icons/location2.png";
import dateStartIcon from "../../../assets/icons/date.png";
import dateEndIcon from "../../../assets/icons/time.png";
import eventImg from "../../../assets/images/event_img.jpeg";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvent } from "./eventSlice";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";



const BACKEND_URL = import.meta.env.VITE_BASE_BACK_END_URL

function LastEvent({ id, img, title, date }) {
  const currentLang = i18n.language;
  return (
    <Link to={`/${currentLang}/evenements/${id}`} className={styles.event}>
      <div className={styles.image}>
        <img src={`${BACKEND_URL}${img}`} alt="" aria-label="loading" />
      </div>

      <div className={styles.details}>
        <h3>{title}</h3>
        <p>
          <img src={dateStartIcon} />
          <span>{date}</span>
        </p>
      </div>
      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6 12H18M18 12L13 7M18 12L13 17"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </Link>
  );
}

function CommonEvent({ id, img, domain, title }) {
  const currentLang = i18n.language;
  return (
    <Link to={`/${currentLang}/evenements/${id}`} className={styles.event}>
      <div className={styles.image}>
        <img src={`${BACKEND_URL}${img}`} aria-label="loading" />
      </div>

      <div className={styles.content}>
        <p>{domain}</p>
        <p>{title}</p>
      </div>
    </Link>
  );
}

function EventPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data, loading } = useSelector((state) => state.event);
  const { t } = useTranslation("event_page");
  const currentLang = i18n.language || "fr";
  const pageRef = useRef(null)




  useEffect(() => {
    dispatch(fetchEvent({ id, lang: currentLang }));
    pageRef.current.scrollIntoView({behavior: "smooth"})
    setCurrentImage(0)
  }, [dispatch, currentLang, id]);

  const images = data?.images || [];
  const LastEvents = data?.lasted_events || [];
  const commonEvents = data?.related_events || [];

  const renderLastEvents = () => {
    return LastEvents.map((event) => <LastEvent key={event.id} {...event} />);
  };

  const renderCommonEvents = () => {
    return commonEvents.map((event) => (
      <CommonEvent key={event.id} {...event} />
    ));
  };

  const renderImages = () => {
    if (images.length > 0) {
      return images.map((image, index) => (
        <SwiperSlide
          onClick={() => setCurrentImage(index)}
          className={`${styles.slide} ${
            index === currentImage ? styles.active : ""
          }`}
          key={index}
        >
          <img src={`${BACKEND_URL}${image.src}`} alt="" aria-label="loading" />
        </SwiperSlide>
      ));
    }

    return Array.from({ length: 10 }, (_, i) => (
      <SwiperSlide
        onClick={() => setCurrentImage(i)}
        className={`${styles.slide} ${i === currentImage ? styles.active : ""}`}
        key={i}
      >
        <img src="" alt="" aria-label="loading" />
      </SwiperSlide>
    ));
  };
  if (loading) {
    return <Loader />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className={styles.eventPage}  ref={pageRef}>
      <PageHero title={data.title} heroImg={heroImg} />

      <div className={styles.eventContentContainer}>
        <section className={styles.row1}>
          <div className={styles.imagesContainer}>
            <div className={styles.mainImage}>
              <img src={`${BACKEND_URL}${images[currentImage]?.src}` || ""} aria-label="loading" />
            </div>
            <div className={styles.imageCarousil}>
              <Swiper
                slidesPerView={"auto"}
                spaceBetween={30}
                className={styles.imgSwiper}
              >
                {renderImages()}
              </Swiper>
            </div>
          </div>

          <div className={styles.details}>
            <h2>{t("event.details")}</h2>

            <div className={styles.infos}>
              <div className={`${styles.location} ${styles.infoWrapper}`}>
                <div>
                  <img src={locationIcon} />
                </div>
                <div>
                  <h3>{t("event.location")}</h3>
                  <p>{data.location}</p>
                </div>
              </div>

              <div className={`${styles.date} ${styles.infoWrapper}`}>
                <div>
                  <img src={dateStartIcon} />
                </div>
                <div>
                  <h3>{t("event.date_start")}</h3>
                  <p>{data.date_start}</p>
                </div>
              </div>

              <div className={`${styles.date} ${styles.infoWrapper}`}>
                <div>
                  <img src={dateEndIcon} />
                </div>
                <div>
                  <h3>{t("event.date_end")}</h3>
                  <p>{data.date_end}</p>
                </div>
              </div>
            </div>

            <div
              className={styles.eventAddImg}
              style={{ backgroundImage: `url(${eventImg})` }}
            >
              <Link to={`/${currentLang}/join-us`}>
                {t("event.benevole_btn")}
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.row2}>
          <div className={styles.col1}>
            <h2 className={styles.title}>{data.title}</h2>
            <p className={styles.categorie}>
              {t("event.category")} : {data.category}
            </p>
            <p className={styles.description}>{data.description}</p>

            <h2 className={styles.commonEventsTitle}>
              {t("event.common_events")}
            </h2>
            <div className={styles.commonEvents}>{renderCommonEvents()}</div>
          </div>
          <div className={styles.col2}>
            <div className={styles.wrapper}>
              <h3>{t("event.last_posts")}</h3>
              <div className={styles.lastEvents}>{renderLastEvents()}</div>
            </div>

            <div className={styles.wrapper}>
              <h3>{t("event.contribute")}</h3>
              <p>{t("event.contribute_text")}</p>
              <Link className={styles.btn}>{t("event.donate_btn")}</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EventPage;
