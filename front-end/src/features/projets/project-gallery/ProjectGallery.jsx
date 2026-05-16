import { div } from "framer-motion/client";
import styles from "./projectGallery.module.css";
import ShowMoreButton from "../../../components/common/ShowMoreButton";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProjectImages, setImagesPage } from "./projectImagesSlice";
import { useTranslation } from "react-i18next";


const BACKEND_URL = import.meta.env.VITE_BASE_BACK_END_URL

function ProjectGallery({ id }) {
  const dispatch = useDispatch();
  const { currentPage, totalPages, images, loading } = useSelector(
    (state) => state.projectImages,
  );
  const {t} = useTranslation("common");

  useEffect(() => {
    dispatch(fetchProjectImages({ project: id, page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    dispatch(setImagesPage({ page }));
  };

  const generateImages = (images) => {
    return images.map((img) => (
      <img src={`${BACKEND_URL}${img.src}`} alt={img.alt} key={img.id} aria-label="loading" />
    ));
  };

  return (
    <div className={styles.galleryContainer}>
      <h1 className={styles.galleryTitle}>{t('gallery.title')}</h1>
      <div className={styles.gallery}>{generateImages(images)}</div>
      <ShowMoreButton
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default ProjectGallery;
