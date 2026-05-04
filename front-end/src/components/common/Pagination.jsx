import { useTranslation } from "react-i18next";
import styles from "./pagination.module.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const { t } = useTranslation('pagination')
  if(!currentPage || !totalPages) return null
  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always include first and last
    if (currentPage <= 3) {
      return [1, 2, 3, , 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Middle case
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };
  const pages = getPages();

  return (
    <div className={styles.pagination}>
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage >= 1 ? currentPage - 1 : currentPage)}
        className={`${styles.pageButton} ${styles.prevNext}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="10px"
          height="10px"
          viewBox="-4.5 0 20 20"
          version="1.1"
          className="arrowIcon"
        >
          <title>arrow_right [#336]</title>
          <desc>Created with Sketch.</desc>
          <defs></defs>
          <g
            id="Page-1"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
          >
            <g
              id="Dribbble-Light-Preview"
              transform="translate(-305.000000, -6679.000000)"
              fill="currentColor"
            >
              <g id="icons" transform="translate(56.000000, 160.000000)">
                <path
                  d="M249.365851,6538.70769 L249.365851,6538.70769 C249.770764,6539.09744 250.426289,6539.09744 250.830166,6538.70769 L259.393407,6530.44413 C260.202198,6529.66364 260.202198,6528.39747 259.393407,6527.61699 L250.768031,6519.29246 C250.367261,6518.90671 249.720021,6518.90172 249.314072,6519.28247 L249.314072,6519.28247 C248.899839,6519.67121 248.894661,6520.31179 249.302681,6520.70653 L257.196934,6528.32352 C257.601847,6528.71426 257.601847,6529.34685 257.196934,6529.73759 L249.365851,6537.29462 C248.960938,6537.68437 248.960938,6538.31795 249.365851,6538.70769"
                  id="arrow_right-[#336]"
                ></path>
              </g>
            </g>
          </g>
        </svg>
        <span>{t('prev')}</span>
      </button>

      <div className={styles.pageNumbers}>
        {pages.map((page, index) =>
          page === "..." ? (
            <span key={index} className={styles.dots}>
              ...
            </span>
          ) : (
            <button
              key={index}
              className={`${styles.pageNumber} ${
                currentPage === page ? styles.active : ""
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
        className={`${styles.pageButton} ${styles.prevNext}`}
        disabled={currentPage >= totalPages}
      >
        <span>{t('next')}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="10px"
          height="10px"
          viewBox="-4.5 0 20 20"
          version="1.1"
          className="arrowIcon"
        >
          <title>arrow_right [#336]</title>
          <desc>Created with Sketch.</desc>
          <defs></defs>
          <g
            id="Page-1"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
          >
            <g
              id="Dribbble-Light-Preview"
              transform="translate(-305.000000, -6679.000000)"
              fill="currentColor"
            >
              <g id="icons" transform="translate(56.000000, 160.000000)">
                <path
                  d="M249.365851,6538.70769 L249.365851,6538.70769 C249.770764,6539.09744 250.426289,6539.09744 250.830166,6538.70769 L259.393407,6530.44413 C260.202198,6529.66364 260.202198,6528.39747 259.393407,6527.61699 L250.768031,6519.29246 C250.367261,6518.90671 249.720021,6518.90172 249.314072,6519.28247 L249.314072,6519.28247 C248.899839,6519.67121 248.894661,6520.31179 249.302681,6520.70653 L257.196934,6528.32352 C257.601847,6528.71426 257.601847,6529.34685 257.196934,6529.73759 L249.365851,6537.29462 C248.960938,6537.68437 248.960938,6538.31795 249.365851,6538.70769"
                  id="arrow_right-[#336]"
                ></path>
              </g>
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
}
