const toPartenariathomeListDTO = (p, lang) => ({
    id:    p.id,
    name:  p[`nom_${lang}`] || p.nom_fr || null,
    image: p.logo || null
});

module.exports = { toPartenariathomeListDTO };
