import { Link, useParams } from "react-router-dom";
import heroImg from "../../../assets/images/projects_hero.jpg";
import PageHero from "../../../components/common/PageHero";
import styles from "./projectPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProject } from "./projectSlice";
import { div, p } from "framer-motion/client";
import ProjectGallery from "../project-gallery/ProjectGallery";

const ProjectPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data, loading, error } = useSelector((state) => state.project);

  const { title, description, img, status, meta } = data;

  useEffect(() => {
    dispatch(fetchProject(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className={styles.projectPage}>
      <PageHero heroImg={heroImg} title={title} />

      <div className={styles.statusBar}>
        <span>PEOPLE HELPED : {status.peopleHelped}</span>
        <span className={styles.devider}></span>
        <span>TARGET REGION : {status.targetRegion}</span>
        <span className={styles.devider}></span>
        <span>STATUS : {status.projectStatus}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.project}>
          <div className={styles.projectImage}>
            <img src={img} alt="" aria-label="loading"/>
          </div>

          <div className={styles.details}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>

            <div className={styles.metaBox}>
              <div>
                <strong>Completation :</strong>
                {meta.completion}
              </div>

              <div>
                <strong>Partenaires :</strong>
                {meta.partners}
              </div>

              <div>
                <strong>Domaine :</strong>
                {meta.domain}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.btns}>
          <Link to={`/${currentLang}/join-us`}>{t("project.vol_btn")}</Link>
          <Link to={`/${currentLang}/donate?project_id=${id}`}>{t("project.donate_btn")}</Link>
        </div>

        <div className={styles.devider}></div>

        <ProjectGallery id={id} />
      </div>
    </div>
  );
};

export default ProjectPage;
