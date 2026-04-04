const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage Multer
const storage = (subfolder) => multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../data', subfolder);
        
        // Vérifier si le dossier existe (au cas où)
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
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

// Filtre pour n'accepter que les images
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = allowedTypes.test(file.mimetype);
    const extension = allowedTypes.test(ext);

    if (mimetype && extension) {
        return cb(null, true);
    } else {
        cb(new Error("Format de fichier non supporté. Accepte seulement : JPEG, JPG, PNG, WEBP, GIF"), false);
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
        fileFilter: imageFilter,
        limits: {
            fileSize: 5 * 1024 * 1024 // 5 Mo maximum
        }
    }).single(fieldName);
};

module.exports = uploadMiddleware;
