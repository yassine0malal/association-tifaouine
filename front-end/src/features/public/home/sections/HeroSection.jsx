import styles from "./heroSection.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import carousel1 from '../../../../assets/images/home/carousel1.png'
import carousel2 from '../../../../assets/images/home/carousel2.png'
import carousel3 from '../../../../assets/images/home/carousel3.png'
import carousel4 from '../../../../assets/images/home/carousel4.png'

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const domains = [
  {
    id: "education",
    label: "Education & Literacy",
    description:
      "Promoting access to quality education through literacy programs, school support, and training initiatives for children and adults in rural communities.",
    img:carousel1
  },
  {
    id: "health",
    label: "Health & Well-being",
    description:
      "Improving community health through medical caravans, awareness campaigns, and access to basic healthcare services in underserved areas.",
      img:carousel2
  },
  {
    id: "agricultur",
    label: "Environment & Sustainability",
    description:
      "Protecting natural resources by organizing environmental campaigns, promoting sustainable practices, and supporting local ecological initiatives.",
      img:carousel3
  },
  {
    id: "social",
    label: "Social Development & Solidarity",
    description:
      "Strengthening social cohesion by supporting vulnerable groups, organizing solidarity actions, and fostering community engagement and inclusion.",
      img:carousel4
  },
];

function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className={styles.swiper}
        >
          {domains.map((domain) => (
            <SwiperSlide key={domain.id} className={styles.swiperSlide}>
              <div style={{backgroundImage:`url(${domain.img})`}}>
                <h1 className={styles.title}>{domain.id.toLocaleUpperCase()}</h1>
                <p className={styles.description}>{domain.description}</p>
                <Link to="">See More</Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default HeroSection;
