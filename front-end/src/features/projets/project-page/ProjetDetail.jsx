import { Link, useParams } from "react-router-dom";
import heroImg from "../../../assets/images/heros/hero1.jpeg";
import PageHero from "../../../components/common/PageHero";
import styles from "./projectPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProject } from "./projectSlice";
import { div, p } from "framer-motion/client";
import ProjectGallery from "../project-gallery/ProjectGallery";
import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";



const BACKEND_URL = import.meta.env.VITE_BASE_BACK_END_URL;


const ProjectPage = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("project_page");
  const { id } = useParams();
  const { data, loading, error } = useSelector((state) => state.project);
  console.log(data);
  
  const { title, description, img, status, meta } = data;
  const currentLang = i18n.language;

  useEffect(() => {
    dispatch(fetchProject({id , lang:currentLang}));
  }, [dispatch, id , currentLang]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (!data) {
    return <Loader />;
  }

  return (
    <div className={styles.projectPage}>
      <PageHero heroImg={heroImg} title={title} />

      <div className={styles.statusBar}>
        <span>{t('project.peopleHelped')} : {status.peopleHelped}</span>
        <span className={styles.devider}></span>
        <span>{t('project.target_region')}: {status.targetRegion}</span>
        <span className={styles.devider}></span>
        <span>{t('project.status')} : {status.projectStatus}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.project}>
          <div className={styles.projectImage}>
            <img src={`${BACKEND_URL}${img}`} alt="" aria-label="loading" />
          </div>

          <div className={styles.details}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>

            <div className={styles.metaBox}>
              <div>
                <strong>{t('project.completion')} :</strong>
                {meta.completion || t('project.default.completion')}
              </div>

              <div>
                <strong>{t('project.partners')} :</strong>
                {meta.partners || t('project.default.partners')}
              </div>

              <div>
                <strong>{t('project.domain')} :</strong>
                {meta.domain || t('project.default.domain')}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.btns}>
          <Link to={`/${currentLang}/join-us`}>{t("project.vol_btn")}</Link>
          <Link to={`/${currentLang}/donate?project_id=${id}`}>
            {t("project.donate_btn")}
          </Link>
        </div>

        <div className={styles.devider}></div>

        <ProjectGallery id={id} />
      </div>
    </div>
  );
};

export default ProjectPage;
