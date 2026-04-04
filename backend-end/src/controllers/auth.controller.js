const authService = require('../services/auth.service');

class AuthController {

    /**
     * @route   POST /api/auth/login
     * @desc    Connexion de l'administrateur
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "L'email et le mot de passe sont obligatoires."
                });
            }

            const data = await authService.loginAdmin(email, password);

            res.cookie('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict', // Protection CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
            });

            return res.status(200).json({
                success: true,
                message: "Connexion réussie.",
                accessToken: data.accessToken,
                user: data.user
            });

        } catch (error) {
            console.error("Erreur login controller : ", error.message);
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   POST /api/auth/refresh-token
     * @desc    Rafraîchir l'access token
     */
    async refreshToken(req, res) {
        try {
            // Lecture exclusive depuis les cookies pour plus de sécurité
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "Refresh Token manquant."
                });
            }

            const data = await authService.refreshAdminToken(refreshToken);

            return res.status(200).json({
                success: true,
                accessToken: data.accessToken
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   POST /api/auth/logout
     * @desc    Déconnexion de l'administrateur
     */
    async logout(req, res) {
        try {
            const accessToken = req.token;
            const refreshToken = req.cookies.refreshToken;

            await authService.logoutAdmin(accessToken, refreshToken);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict'
            });

            return res.status(200).json({
                success: true,
                message: "Déconnexion réussie."
            });
        } catch (error) {
            console.error("Erreur logout controller : ", error.message);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la déconnexion."
            });
        }
    }

    /**
     * @route   GET /api/auth/profile
     * @desc    Récupérer le profil admin via le token
     */
    async getProfile(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    success: false,
                    message: "Utilisateur non identifié."
                });
            }

            const profile = await authService.getAdminProfile(req.user.id);

            return res.status(200).json({
                success: true,
                user: profile
            });

        } catch (error) {
            console.error("Erreur profile controller : ", error.message);
            return res.status(500).json({
                success: false,
                message: "Impossible de récupérer le profil."
            });
        }
    }

    /**
     * @route   PATCH /api/auth/update-profile
     * @desc    Mettre à jour le profil admin
     */
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { nom, email, password } = req.body;

            const updatedProfile = await authService.updateAdminProfile(userId, { nom, email, password });

            return res.status(200).json({
                success: true,
                message: "Profil mis à jour avec succès.",
                user: updatedProfile
            });

        } catch (error) {
            console.error("Erreur updateProfile controller : ", error.message);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AuthController();

