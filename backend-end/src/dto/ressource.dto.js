/**
 * DTOs pour les ressources — retourne uniquement les champs nécessaires au frontend
 * selon la langue demandée
 */

const formatSize = (bytes) => {
    if (!bytes) return null;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

/**
 * DTO document de l'association — correspond à la page ressources/documents
 */
const toDocumentDTO = (r, lang) => ({
    id:          r.id,
    title:       r[`titre_${lang}`]       || r.titre_fr       || r.titre_en       || null,
    description: r[`description_${lang}`] || r.description_fr || r.description_en || null,
    imageUrl:    r.image_couverture       || null,
    downloadUrl: r.url,
    fileType:    r.file_type ? r.file_type.toUpperCase() : null,
    fileSize:    formatSize(r.file_size),
    type:        r.type
});

module.exports = { toDocumentDTO };
