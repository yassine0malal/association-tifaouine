const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const cleanFolderName = (name) =>
    name.toLowerCase()
        .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

const getMediaType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    if (/jpeg|jpg|png|webp|gif/.test(ext)) return 'images';
    if (/mp4|webm|mov|mkv|avi/.test(ext))  return 'videos';
    return 'documents';
};

const mediaFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|mp4|webm|mov|mkv|avi|pdf|doc|docx|xls|xlsx/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(file.mimetype) || allowed.test(ext)) return cb(null, true);
    cb(new Error("Format non supporté. Accepté : images, vidéos, documents"), false);
};

const imageFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (/jpeg|jpg|png|webp|gif/.test(ext)) return cb(null, true);
    cb(new Error("Format non supporté. Accepté : JPG, PNG, WEBP, GIF"), false);
};

const makeFilename = (prefix) => (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
};

const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

// ─── 1. Upload simple — profils, logos, icônes ───────────────────────────────

const uploadSimple = (subfolder, fieldName) => multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dest = path.join(__dirname, '../data', subfolder);
            ensureDir(dest);
            cb(null, dest);
        },
        filename: makeFilename('f')
    }),
    fileFilter: mediaFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
}).single(fieldName);

// ─── 2. Upload image principale d'un projet ───────────────────────────────────

const uploadProjetPrincipal = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const folder = cleanFolderName(req.body.titre_fr || 'projet_sans_titre');
            const dest   = path.join(__dirname, `../data/ressources/images/projets/${folder}/principal`);
            ensureDir(dest);
            req.uploadedUrl = `/data/ressources/images/projets/${folder}/principal`;
            cb(null, dest);
        },
        filename: makeFilename('principal')
    }),
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
}).single('image_principale');

// ─── 3. Upload image principale d'un événement ───────────────────────────────

const uploadEvenementPrincipal = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const folder = cleanFolderName(req.body.titre_fr || 'evenement_sans_titre');
            const dest   = path.join(__dirname, `../data/ressources/images/evenements/${folder}/principal`);
            ensureDir(dest);
            req.uploadedUrl = `/data/ressources/images/evenements/${folder}/principal`;
            cb(null, dest);
        },
        filename: makeFilename('principal')
    }),
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
}).single('image_principale');

// ─── 4. Upload ressources (galerie) — single ou multiple ─────────────────────
// Le nom du fichier stocké sur disque garde un timestamp pour éviter les conflits
// physiques, mais on stocke aussi le nom_original en DB pour détecter les doublons.

const { Projet, Evenement } = require('../models');

const ressourceStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const mediaType   = getMediaType(file.originalname);
            const projetId    = req.body.projet_id;
            const evenementId = req.body.evenement_id;

            let dest, relUrl;

            if (projetId && mediaType === 'images') {
                const projet = await Projet.findByPk(projetId, { attributes: ['titre_fr'] });
                const folder = projet ? cleanFolderName(projet.titre_fr) : `projet_${projetId}`;
                dest   = path.join(__dirname, `../data/ressources/images/projets/${folder}/galerie`);
                relUrl = `/data/ressources/images/projets/${folder}/galerie`;
            } else if (evenementId && mediaType === 'images') {
                const evt    = await Evenement.findByPk(evenementId, { attributes: ['titre_fr'] });
                const folder = evt ? cleanFolderName(evt.titre_fr) : `evenement_${evenementId}`;
                dest   = path.join(__dirname, `../data/ressources/images/evenements/${folder}/galerie`);
                relUrl = `/data/ressources/images/evenements/${folder}/galerie`;
            } else {
                dest   = path.join(__dirname, `../data/ressources/${mediaType}`);
                relUrl = `/data/ressources/${mediaType}`;
            }

            ensureDir(dest);

            if (!req.uploadedUrls) req.uploadedUrls = [];
            file._urlIndex = req.uploadedUrls.length;
            req.uploadedUrls.push({ relUrl });

            cb(null, dest);
        } catch (err) {
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        const ext      = path.extname(file.originalname);
        const filename = `r-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        if (req.uploadedUrls && file._urlIndex !== undefined) {
            req.uploadedUrls[file._urlIndex].filename = filename;
        }
        cb(null, filename);
    }
});

const uploadRessources = multer({
    storage: ressourceStorage,
    fileFilter: mediaFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
}).array('files', 20);

module.exports = {
    uploadSimple,
    uploadProjetPrincipal,
    uploadEvenementPrincipal,
    uploadRessources
};
