const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const { cleanFolderName } = require('../utils/fileHelpers');

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

const videoFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (/mp4|webm|mov|mkv|avi/.test(ext)) return cb(null, true);
    cb(new Error("Format non supporté. Accepté : MP4, WEBM, MOV, MKV, AVI"), false);
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

// ─── 4. Upload ressources — fichiers + couverture optionnelle en un seul appel
// fields: 'files' (documents/images/vidéos, max 20) + 'image_couverture' (image, max 1)
// La destination est déterminée par le fieldname :
//   - 'image_couverture' → images/documents/couvertures/
//   - 'files'            → logique habituelle selon mediaType + projet/événement

const { Projet, Evenement } = require('../models');

const ressourceStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            // ── Couverture : destination fixe
            if (file.fieldname === 'image_couverture') {
                const dest = path.join(__dirname, '../data/ressources/images/documents/couvertures');
                ensureDir(dest);
                req._couvertureRelUrl = '/data/ressources/images/documents/couvertures';
                return cb(null, dest);
            }

            // ── Fichiers principaux
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
            } else if (projetId && mediaType === 'documents') {
                const projet = await Projet.findByPk(projetId, { attributes: ['titre_fr'] });
                const folder = projet ? cleanFolderName(projet.titre_fr) : `projet_${projetId}`;
                dest   = path.join(__dirname, `../data/ressources/documents/projets/${folder}`);
                relUrl = `/data/ressources/documents/projets/${folder}`;
            } else if (evenementId && mediaType === 'documents') {
                const evt    = await Evenement.findByPk(evenementId, { attributes: ['titre_fr'] });
                const folder = evt ? cleanFolderName(evt.titre_fr) : `evenement_${evenementId}`;
                dest   = path.join(__dirname, `../data/ressources/documents/evenements/${folder}`);
                relUrl = `/data/ressources/documents/evenements/${folder}`;
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
        const ext = path.extname(file.originalname);

        if (file.fieldname === 'image_couverture') {
            const filename = `couverture-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
            req._couvertureFilename = filename;
            return cb(null, filename);
        }

        const filename = `r-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        if (req.uploadedUrls && file._urlIndex !== undefined) {
            req.uploadedUrls[file._urlIndex].filename = filename;
        }
        cb(null, filename);
    }
});

const combinedFilter = (req, file, cb) => {
    if (file.fieldname === 'image_couverture') return imageFilter(req, file, cb);
    return mediaFilter(req, file, cb);
};

const uploadRessources = multer({
    storage: ressourceStorage,
    fileFilter: combinedFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
}).fields([
    { name: 'files',            maxCount: 20 },
    { name: 'image_couverture', maxCount: 1  }
]);

// ─── 5. Upload projet complet (image principale + galerie images + vidéos) ────
// fields:
//   'imagePrincipale' (image, max 1)   → /images/projets/{folder}/principal/
//   'extraImages'     (images, max 20) → /images/projets/{folder}/galerie/
//   'extraVideos'     (vidéos, max 10) → /videos/projets/{folder}/

const projetCompletStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = cleanFolderName(req.body.titre_fr || 'projet_sans_titre');

        if (file.fieldname === 'imagePrincipale') {
            const dest = path.join(__dirname, `../data/ressources/images/projets/${folder}/principal`);
            ensureDir(dest);
            req._principalRelUrl = `/data/ressources/images/projets/${folder}/principal`;
            return cb(null, dest);
        }

        if (file.fieldname === 'extraImages') {
            const dest = path.join(__dirname, `../data/ressources/images/projets/${folder}/galerie`);
            ensureDir(dest);
            if (!req._galerieRelUrl) req._galerieRelUrl = `/data/ressources/images/projets/${folder}/galerie`;
            return cb(null, dest);
        }

        // extraVideos
        const dest = path.join(__dirname, `../data/ressources/videos/projets/${folder}`);
        ensureDir(dest);
        if (!req._videosRelUrl) req._videosRelUrl = `/data/ressources/videos/projets/${folder}`;
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const ext    = path.extname(file.originalname);
        const prefix = file.fieldname === 'imagePrincipale' ? 'principal'
                     : file.fieldname === 'extraImages'     ? 'galerie'
                     : 'video';
        cb(null, `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    }
});

const projetCompletFilter = (req, file, cb) => {
    if (file.fieldname === 'extraVideos') return videoFilter(req, file, cb);
    return imageFilter(req, file, cb);
};

const uploadProjetComplet = multer({
    storage: projetCompletStorage,
    fileFilter: projetCompletFilter,
    limits: { fileSize: 200 * 1024 * 1024 } // 200MB pour supporter les vidéos
}).fields([
    { name: 'imagePrincipale', maxCount: 1  },
    { name: 'extraImages',     maxCount: 20 },
    { name: 'extraVideos',     maxCount: 10 }
]);

// ─── 6. Upload formulaire "Être membre" ──────────────────────────────────────
// fields: photo (image), identity_card (doc), cv_doc (doc)

const uploadEtreMembre = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const subfolders = {
                photo:         'membres/photos',
                identity_card: 'membres/identites',
                cv_doc:        'membres/cvs'
            };
            const sub  = subfolders[file.fieldname] || 'membres';
            const dest = path.join(__dirname, '../data', sub);
            ensureDir(dest);
            cb(null, dest);
        },
        filename: makeFilename('r')
    }),
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'photo') return imageFilter(req, file, cb);
        return mediaFilter(req, file, cb);
    },
    limits: { fileSize: 10 * 1024 * 1024 }
}).fields([
    { name: 'photo',         maxCount: 1 },
    { name: 'identity_card', maxCount: 1 },
    { name: 'cv_doc',        maxCount: 1 }
]);

// ─── 6. Upload formulaire "Être bénévole" ────────────────────────────────────
// fields: photo (image), identity_card (doc)

const uploadEtreBenevole = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const subfolders = {
                photo:         'benevoles/photos',
                identity_card: 'benevoles/identites'
            };
            const sub  = subfolders[file.fieldname] || 'benevoles';
            const dest = path.join(__dirname, '../data', sub);
            ensureDir(dest);
            cb(null, dest);
        },
        filename: makeFilename('r')
    }),
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'photo') return imageFilter(req, file, cb);
        return mediaFilter(req, file, cb);
    },
    limits: { fileSize: 10 * 1024 * 1024 }
}).fields([
    { name: 'photo',         maxCount: 1 },
    { name: 'identity_card', maxCount: 1 }
]);

module.exports = {
    uploadSimple,
    uploadProjetPrincipal,
    uploadProjetComplet,
    uploadEvenementPrincipal,
    uploadRessources,
    uploadEtreMembre,
    uploadEtreBenevole
};
