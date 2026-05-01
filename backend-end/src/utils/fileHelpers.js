/**
 * Nettoie un nom pour l'utiliser comme nom de dossier
 * ex: "Projet Eau Potable" → "projet_eau_potable"
 */
const cleanFolderName = (name) =>
    name.toLowerCase()
        .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

module.exports = { cleanFolderName };
