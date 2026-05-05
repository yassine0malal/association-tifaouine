const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const utilisateurRepository = require('../repositories/utilisateur.repository');
const { RefreshToken, TokenBlacklist, sequelize } = require('../models');

class AuthService {
    /**
     * @desc    Générer l'Access Token
     */
    generateAccessToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email, type: user.type },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '1h' }
        );
    }

    /**
     * @desc    Générer et sauver le Refresh Token
     */
    async generateRefreshToken(user) {
        const refreshTokenContent = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
        );

        // Calculer l'expiration pour le stockage en DB
        // '7d' -> 7 * 24 * 60 * 60 * 1000
        const expiresInDays = parseInt(process.env.JWT_REFRESH_EXPIRATION) || 7;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiresInDays);

        await RefreshToken.create({
            token: refreshTokenContent,
            utilisateur_id: user.id,
            expiry_date: expiryDate
        });

        return refreshTokenContent;
    }

    /**
     * @desc    Logique pour la connexion de l'admin
     */
    async loginAdmin(email, password) {
        const user = await utilisateurRepository.findAdminByEmail(email);

        if (!user) {
            throw new Error("Email ou mot de passe incorrect.");
        }

        const isMatch = await bcrypt.compare(password, user.admin.password);
        if (!isMatch) {
            throw new Error("Email ou mot de passe incorrect.");
        }

        const accessToken = this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                type: user.type
            }
        };
    }

    /**
     * @desc    Rafraîchir l'access token
     */
    async refreshAdminToken(token) {
        if (!token) throw new Error("Refresh token manquant.");

        const refreshTokenRecord = await RefreshToken.findOne({ where: { token } });
        if (!refreshTokenRecord) throw new Error("Refresh token invalide.");

        if (refreshTokenRecord.expiry_date.getTime() < new Date().getTime()) {
            await RefreshToken.destroy({ where: { token } });
            throw new Error("Refresh token expiré.");
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            const user = await utilisateurRepository.findAdminById(decoded.id);
            
            if (!user) throw new Error("Utilisateur non trouvé.");

            const newAccessToken = this.generateAccessToken(user);
            return { accessToken: newAccessToken };
        } catch (err) {
            throw new Error("Refresh token invalide.");
        }
    }

    /**
     * @desc    Déconnexion (suppression du refresh token et blacklisting)
     */
    async logoutAdmin(accessToken, refreshToken) {
        // 1. Supprimer le refresh token de la base
        if (refreshToken) {
            await RefreshToken.destroy({ where: { token: refreshToken } });
        }

        // 2. Optionnel : Blacklister l'access token actuel s'il n'est pas expiré
        if (accessToken) {
            try {
                const decoded = jwt.decode(accessToken);
                if (decoded && decoded.exp) {
                    const expiryDate = new Date(decoded.exp * 1000);
                    if (expiryDate > new Date()) {
                        await TokenBlacklist.create({
                            token: accessToken,
                            expiry_date: expiryDate
                        });
                    }
                }
            } catch (err) {
                console.error("Erreur backlisting : ", err);
            }
        }
    }

    /**
     * @desc    Récupérer le profil admin complet
     */
    async getAdminProfile(userId) {
        const user = await utilisateurRepository.findAdminById(userId);
        if (!user) {
            throw new Error("Profil administrateur non trouvé.");
        }

        return {
            id: user.id,
            nom: user.nom,
            email: user.email,
            type: user.type,
            created_at: user.created_at
        };
    }

    /**
     * @desc    Mise à jour du profil admin (Nom, Email, Password)
     */
    async updateAdminProfile(userId, updateData) {
        const { nom, email, password } = updateData;

        return await sequelize.transaction(async (t) => {
            // 1. Charger l'admin complet (avec l'objet admin associé)
            const user = await utilisateurRepository.findAdminById(userId);
            if (!user) {
                throw new Error("Admin non trouvé.");
            }

            // Nettoyer les champs null ou vides
            const cleanedData = {};
            if (nom !== null && nom !== undefined && nom !== '') cleanedData.nom = nom;
            if (email !== null && email !== undefined && email !== '') cleanedData.email = email;
            if (password !== null && password !== undefined && password !== '') cleanedData.password = password;

            // 2. Si on modifie l'email, vérifier s'il est déjà utilisé par un autre
            if (cleanedData.email && cleanedData.email !== user.email) {
                const existingUser = await utilisateurRepository.findAdminByEmail(cleanedData.email);
                if (existingUser) {
                    throw new Error("Cet email est déjà utilisé.");
                }
                user.email = cleanedData.email;
            }

            if (cleanedData.nom) user.nom = cleanedData.nom;

            // 3. Si on modifie le mot de passe, on le hashe
            if (cleanedData.password) {
                user.admin.password = await bcrypt.hash(cleanedData.password, 10);
                await user.admin.save({ transaction: t });
            }

            // 4. Sauvegarder les modifications sur Utilisateur
            await user.save({ transaction: t });

            return {
                id: user.id,
                nom: user.nom,
                email: user.email,
                type: user.type
            };
        });
    }

    /**
     * @desc    Suppression du compte admin
     */
    async deleteAdminProfile(userId) {
        return await sequelize.transaction(async (t) => {
            const user = await utilisateurRepository.findAdminById(userId);
            if (!user) {
                throw new Error("Admin non trouvé.");
            }

            // Supprimer tous les refresh tokens de cet admin
            await RefreshToken.destroy({ 
                where: { utilisateur_id: userId },
                transaction: t 
            });

            // Supprimer l'admin (cascade supprimera aussi l'utilisateur)
            await user.admin.destroy({ transaction: t });
            await user.destroy({ transaction: t });

            return true;
        });
    }
}

module.exports = new AuthService();
