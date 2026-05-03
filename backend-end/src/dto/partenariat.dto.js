/**
 * DTO partenariat — retourne les champs nécessaires au frontend selon la langue
 */
const toPartenariatListDTO = (p, lang) => ({
    id:          p.id,
    name:        p[`nom_${lang}`] || p.nom_fr || null,
    image:       p.logo || null,
    description: p[`description_${lang}`] || p.description_fr || null,
    site_web:    p.site_web || null
});

module.exports = { toPartenariatListDTO };
