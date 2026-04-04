import heroImg from "../../assets/images/projects_hero.jpg";
import PageHero from "../../components/common/PageHero";
import styles from './projectPage.module.css'

const ProjectPage = () => {
  return (
    <div className={styles.projectPage}>
      <PageHero 
        heroImg={heroImg}
        title="CLAIN WATER INITIATIVE - TIFAOUINE"
      />

    </div>
  );
};

export default ProjectPage;