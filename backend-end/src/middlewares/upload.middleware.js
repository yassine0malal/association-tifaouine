const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage Multer
const storage = (subfolder) => multer.diskStorage({
    destination: function (req, file, cb) {
        let finalPath = path.join(__dirname, '../data', subfolder);
        
        // Si on est dans le module ressources, on sépare images, vidéos et documents
        if (subfolder === 'ressources') {
            const ext = path.extname(file.originalname).toLowerCase();
            const isImage = /jpeg|jpg|png|webp|gif/.test(ext);
            const isVideo = /mp4|webm|mov|mkv|avi/.test(ext);
            
            let subType = 'documents';
            if (isImage) subType = 'images';
            else if (isVideo) subType = 'videos';

            finalPath = path.join(finalPath, subType);
        }

        // Vérifier si le dossier existe (au cas où)
        if (!fs.existsSync(finalPath)) {
            fs.mkdirSync(finalPath, { recursive: true });
        }
        cb(null, finalPath);
    },
    filename: function (req, file, cb) {
        // Nettoyage du nom de fichier original (enlever espaces et caractères spéciaux)
        const originalName = file.originalname.split('.')[0].replace(/\s+/g, '_').toLowerCase();
        // Créer un nom unique avec le timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `${originalName}-${uniqueSuffix}${extension}`);
    }
});

// Filtre pour n'accepter que les images, videos et documents standard
const mediaFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|mp4|webm|mov|mkv|avi|pdf|doc|docx|xls|xlsx/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = allowedTypes.test(file.mimetype) || allowedTypes.test(ext);

    if (mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Format de fichier non supporte. Accepte : IMAGES, VIDEOS (MP4, WEBM...), DOCUMENTS (PDF, DOCX, XLSX)"), false);
    }
};

/**
 * Middleware d'upload générique
 * @param {string} subfolder - Le dossier cible dans /data/
 * @param {string} fieldName - Le nom du champ du formulaire (ex: 'photo_profile')
 */
const uploadMiddleware = (subfolder, fieldName) => {
    return multer({
        storage: storage(subfolder),
        fileFilter: mediaFilter,
        limits: {
            fileSize: 50 * 1024 * 1024 // 50 Mo maximum
        }
    }).single(fieldName);
};

module.exports = uploadMiddleware;
