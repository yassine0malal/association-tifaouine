import styles from "./event-page.module.css";
import heroImg from "../../../assets/images/projects_hero.jpg";
import PageHero from "../../../components/common/PageHero";
import locationIcon from "../../../assets/icons/location.png";
import dateIcon from "../../../assets/icons/date.png";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import { useState } from "react";

function RelatedEvent() {
  return (
    <Link className={styles.event}>
      <div className={styles.image}>
        <img src="https://picsum.photos/300/200" alt="" aria-label="loading"/>
      </div>

      <div className={styles.details}>
        <h3>Hol of the event</h3>
        <p>
          <img src={dateIcon} />
          <span>10 Avril, 2023</span>
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

function EventPage() {
  const [currentImage, setCurrentImage] = useState(0);

  const generateImages = (max) => {
    return Array.from(
      { length: max },
      (_, i) => `https://picsum.photos/900/600?random=${i}`,
    );
  };

  const images = generateImages(10);

  const swiperImages = () => {
    return images.map((image, index) => (
      <SwiperSlide
        onClick={() => setCurrentImage(index)}
        className={`${styles.slide} ${index === currentImage ? styles.active : ""}`}
        key={index}
      >
        <img src={image} alt="" aria-label="loading"/>
      </SwiperSlide>
    ));
  };

  return (
    <div className={styles.eventPage}>
      <PageHero title="Details de l’evenment" heroImg={heroImg} />

      <div className={styles.eventContentContainer}>
        <div className={styles.row1}>
          <div className={styles.imagesContainer}>
            <div className={styles.mainImage}>
              <img src={images[currentImage]} aria-label="loading" />
            </div>
            <div className={styles.imageCarousil}>
              <Swiper
                slidesPerView={"auto"}
                spaceBetween={30}
                className={styles.imgSwiper}
              >
                {swiperImages()}
              </Swiper>
            </div>
          </div>

          <div className={styles.details}>
            <h2>Details</h2>

            <div className={styles.infos}>
              <div className={`${styles.location} ${styles.infoWrapper}`}>
                <div>
                  <img src={locationIcon} />
                </div>
                <div>
                  <h3>Location</h3>
                  <p>Doar asni , Al lhouz, Marrakech</p>
                </div>
              </div>

              <div className={`${styles.date} ${styles.infoWrapper}`}>
                <div>
                  <img src={dateIcon} />
                </div>
                <div>
                  <h3>12 Avril</h3>
                  <p>2025 , 7:00 AM</p>
                </div>
              </div>
            </div>

            <div className={styles.locationCard}>
              <iframe
                width="100%"
                height="200"
                loading="lazy"
                src="https://www.google.com/maps?q=31.6295,-7.9811&z=14&output=embed"
              ></iframe>
            </div>
          </div>
        </div>

        <div className={styles.row2}>
          <div className={styles.col1}>
            <h2 className={styles.title}>
              LA CONSTRUCTION D’UN STATATION D’EAU
            </h2>
            <p className={styles.categorie}>
              Catégorie : Le projet de develepement durable
            </p>
            <p className={styles.description}>
              Ce projet representing your event images, this approach allows you
              to highlight key moments by mixing different photo aspect ratios
              and sizes, adding depth and narrative to the gallery section. The
              use of generous whitespace and a clean, professional color palette
              (like deep teal and warm accents shown here) further enhances the
              beauty and readability of the interface. When representing your
              event images, this approach allows you to highlight key moments by
              mixing different photo aspect ratios and sizes, adding depth and
              narrative to the gallery section. The use of generous whitespace
              and a clean, professional color palette (like deep teal and warm
              accents shown here) further enhances the beauty and readability of
              the interface. Ce projet representing your event images, this
              approach allows you to highlight key moments by mixing different
              photo aspect ratios and sizes, adding depth and narrative to the
              gallery section. The use of generous whitespace and a clean,
              professional color palette (like deep teal and warm accents shown
              here) further enhances the beauty and readability of the
              interface. When representing your event images, this approach
              allows you to highlight key moments by mixing different photo
              aspect ratios and sizes, adding depth and narrative to the gallery
              section. The use of generous whitespace and a clean, professional
              color palette (like deep teal and warm accents shown here) further
              enhances the beauty and readability of the interface.
            </p>
          </div>
          <div className={styles.col2}>
            <div className={styles.wrapper}>
              <h3>Dernière Posts</h3>
              <div className={styles.relatedEvents}>
                <RelatedEvent />
                <RelatedEvent />
                <RelatedEvent />
              </div>
            </div>

            <div className={styles.wrapper}>
              <h3>Contribuer</h3>
              <p>
                Votre soutien peut faire la différence. Chaque don, même le plus
                petit, contribue à améliorer des vies et à construire un avenir
                meilleur. Rejoignez-nous dans cette mission solidaire.
              </p>
              <Link className={styles.btn}>Faire une don</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventPage;
