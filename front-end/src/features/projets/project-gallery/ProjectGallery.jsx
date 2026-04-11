import { div } from "framer-motion/client";
import styles from "./projectGallery.module.css";
import ShowMoreButton from "../../../components/common/ShowMoreButton";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProjectImages, setImagesPage } from "./projectImagesSlice";

function ProjectGallery({ id }) {
  const dispatch = useDispatch();
  const { currentPage, totalPages, images, loading } = useSelector(
    (state) => state.projectImages,
  );

  console.log("test");

  useEffect(() => {
    dispatch(fetchProjectImages({ project: id, page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    dispatch(setImagesPage({ page }));
  };

  const generateImages = (images) => {
    return images.map((img) => (
      <img src={img.src} alt={img.alt} key={img.id} aria-label="loading" />
    ));
  };

  return (
    <div className={styles.galleryContainer}>
      <h1 className={styles.galleryTitle}>Project Album</h1>
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
