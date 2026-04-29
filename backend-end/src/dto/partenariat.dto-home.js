const toPartenariathomeListDTO = (p, lang) => ({
    id:          p.id,
    name:         p.nom,
    image:        p.logo || null

});

module.exports = { toPartenariathomeListDTO };
