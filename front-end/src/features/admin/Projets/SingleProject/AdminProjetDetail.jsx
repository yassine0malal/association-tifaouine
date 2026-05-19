import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProject } from "./projectSliceAdmin";
import BackButton from "../../../../components/common/admin/BackButton";
import styles from "./AdminProjetDetail.module.css";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

const STATUS_COLORS = {
  "Planifié": { bg: "#faeeda", color: "#ba7517" },
  "En cours": { bg: "#eaf3de", color: "#3b6d11" },
  "Terminé": { bg: "#e6f1fb", color: "#185fa5" },
  "Suspendu": { bg: "#fcebeb", color: "#a32d2d" },
};

export default function AdminProjetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: projectData, loading, error } = useSelector(
    (state) => state.singleProject || {}
  );

  const { data: domains, status: domainsStatus } = useSelector((state) => state.domains);



  useEffect(() => {
    if (id) dispatch(fetchProject({ id, lang: "fr" }));
  }, [dispatch, id]);

  if (loading) return <p style={{ padding: "40px" }}>Chargement du projet #{id}...</p>;
  if (error) return <p style={{ padding: "40px", color: "red" }}>Erreur : {error}</p>;

  const p = projectData?.data || projectData || {};
  const statusStyle = STATUS_COLORS[p.statut] || STATUS_COLORS["Planifié"];

  const domainName = domains?.find(d => d.id === p.domaine_id)?.label || "—";
  
  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <BackButton />
        <div className={styles.headerActions}>
          <button
            className={styles.editBtn}
            onClick={() => navigate(`/admin/projets/${id}/edit`)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            Modifier
          </button>
        </div>
      </div>

      {/* ── Hero Image ── */}
      {p.image_principale && (
        <div className={styles.heroImage}>
          <img
            src={`${BASE_BACK_END_URL}${p.image_principale}`}
            alt={p.titre_fr}
          />
          <span className={styles.statusBadge} style={{ background: statusStyle.bg, color: statusStyle.color }}>
            {p.statut}
          </span>
        </div>
      )}

      {/* ── Titres multilingues ── */}
      <div className={styles.titlesRow}>
        <div className={styles.titleCard}>
          <span className={styles.langTag}>FR</span>
          <h1 className={styles.titleMain}>{p.titre_fr}</h1>
        </div>
        {p.titre_ar && (
          <div className={`${styles.titleCard} ${styles.rtl}`}>
            <span className={styles.langTag}>AR</span>
            <h2 className={styles.titleAlt} dir="rtl">{p.titre_ar}</h2>
          </div>
        )}
        {p.titre_en && (
          <div className={styles.titleCard}>
            <span className={styles.langTag}>EN</span>
            <h2 className={styles.titleAlt}>{p.titre_en}</h2>
          </div>
        )}
      </div>

      {/* ── Meta infos ── */}
      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Localisation</span>
          <span className={styles.metaValue}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {p.localisation || "—"}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Budget</span>
          <span className={styles.metaValue}>{p.budget ? `${p.budget} DH` : "—"}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Bénéficiaires</span>
          <span className={styles.metaValue}>{p.nb_beneficiaires || "—"}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Date de début</span>
          <span className={styles.metaValue}>{p.date_debut ? p.date_debut.slice(0, 10) : "—"}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Date de fin</span>
          <span className={styles.metaValue}>{p.date_fin ? p.date_fin.slice(0, 10) : "—"}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Domaine</span>
          <span className={styles.metaValue}>{domainName}</span>
        </div>
      </div>

      {/* ── Descriptions ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Descriptions</h3>
        <div className={styles.descGrid}>
          <div className={styles.descCard}>
            <span className={styles.langTag}>FR</span>
            <p>{p.description_fr || "—"}</p>
          </div>
          {p.description_ar && (
            <div className={`${styles.descCard} ${styles.rtl}`}>
              <span className={styles.langTag}>AR</span>
              <p dir="rtl">{p.description_ar}</p>
            </div>
          )}
          {p.description_en && (
            <div className={styles.descCard}>
              <span className={styles.langTag}>EN</span>
              <p>{p.description_en}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Partenaires ── */}
      {p.partenaires?.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Partenaires</h3>
          <div className={styles.partnersList}>
            {p.partenaires.map((partner, i) => (
              <span key={i} className={styles.partnerTag}>
                {partner.nom || partner.name || partner}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.divider} />

      {/* ── Galerie photos ── */}
      {p.images?.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4a050" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Galerie photos
          </h3>
          <div className={styles.photoGrid}>
            {p.images.map((img, i) => (
              <div key={i} className={styles.photoItem}>
                <img
                  src={img.url?.startsWith("http") ? img.url : `${BASE_BACK_END_URL}${img.url}`}
                  alt={`photo-${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Vidéos ── */}
      {p.videos?.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4a050" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            Vidéos
          </h3>
          <div className={styles.videoGrid}>
            {p.videos.map((v, i) => {
              const url = typeof v === "string"
                ? (v.startsWith("http") ? v : `${BASE_BACK_END_URL}${v}`)
                : `${BASE_BACK_END_URL}${v.url}`;
              return (
                <div key={i} className={styles.videoItem}>
                  <video src={url} controls className={styles.videoPlayer} />
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}