require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

/**
 * Vérification de la configuration critique
 */
const requiredEnv = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'PORT', 'FRONTEND_URL'];
requiredEnv.forEach(key => {
    if (!process.env[key]) {
        console.error(`[ERREUR FATALE] : La variable d'environnement ${key} est manquante.`);
        process.exit(1);
    }
});

// Servir les fichiers statiques (Photos des membres, bénévoles, etc.)
app.use('/data', express.static(path.join(__dirname, 'src', 'data')));
const PORT = process.env.PORT || 5000;

// Middleware de sécurité
app.use(helmet());

// Configuration CORS sécurisée
const corsOptions = {
    origin: process.env.FRONTEND_URL, // Autorise uniquement l'URL de votre site
    credentials: true,               // Autorise l'envoi des cookies sécurisés (HttpOnly)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Route de base
app.get('/', (req, res) => {
    res.json({ message: "API Tifaouine Running" });
});

const apiRoutes = require('./src/routes');
app.use('/api', apiRoutes);

const { sequelize } = require('./src/config/database');

// Vérification de la connexion à la base de données avant de démarrer le serveur
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log(' Connexion à PostgreSQL établie avec succès');

        await sequelize.sync({ alter: false });

        app.listen(PORT, () => {
            console.log(`Serveur démarré sur http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(' Impossible de se connecter à la base de données :', error);
        process.exit(1);
    }
};

startServer();
