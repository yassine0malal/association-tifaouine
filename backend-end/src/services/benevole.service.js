const { sequelize, Utilisateur, benevole } = require('../models');
const benevoleRepository = require('../repositories/benevole.repository');
const fs = require('fs');
const path = require('path');

class BenevoleService {
    /**
     * @desc    Créer un ou plusieurs bénévoles dans une transaction
     * @param   {Array|Object} data - Données du/des bénévoles 
     */
    async createBenevoles(data) {
        const benevolesData = Array.isArray(data) ? data : [data];

        return await sequelize.transaction(async (t) => {
            const createdResults = [];

            for (const item of benevolesData) {
                const { nom, email, mession, disponibilite, status, date_adhesion } = item;

                // 1. Vérifier si l'email existe déjà
                const existingUser = await benevoleRepository.findByEmail(email);
                if (existingUser) {
                    throw new Error(`L'email ${email} est déjà utilisé.`);
                }

                // 2. Créer l'Utilisateur
                const user = await Utilisateur.create({
                    nom,
                    email,
                    type: 'benevole'
                }, { transaction: t });

                // 3. Créer le profil Bénévole lié
                const benevoleProfile = await benevole.create({
                    utilisateur_id: user.id,
                    mession: mession || 'benevole',
                    disponibilite: disponibilite || null,
                    status: status || 'actif',
                    date_adhesion: date_adhesion || new Date()
                }, { transaction: t });

                createdResults.push({
                    id: user.id,
                    nom: user.nom,
                    email: user.email,
                    mession: benevoleProfile.mession,
                    status: benevoleProfile.status,
                    created_at: user.created_at
                });
            }

            return createdResults;
        });
    }

    /**
     * @desc    Récupérer tous les bénévoles
     */
    async getAllBenevoles() {
        const list = await benevoleRepository.findAll();
        return list.map(b => ({
            id: b.id,
            nom: b.nom,
            email: b.email,
            mession: b.benevole.mession,
            status: b.benevole.status,
            disponibilite: b.benevole.disponibilite,
            date_adhesion: b.benevole.date_adhesion
        }));
    }

    /**
     * @desc    Récupérer un bénévole par son Email
     */
    async getBenevoleByEmail(email) {
        const b = await benevoleRepository.findByEmail(email);
        if (!b) throw new Error("Bénévole avec cet email non trouvé.");
        return this._formatBenevole(b);
    }

    /**
     * @desc    Récupérer un bénévole par son ID
     */
    async getBenevoleById(id) {
        const b = await benevoleRepository.findById(id);
        if (!b) throw new Error("Bénévole avec cet ID non trouvé.");
        return this._formatBenevole(b);
    }

    /**
     * @desc    Récupérer un bénévole par son Nom
     */
    async getBenevoleByName(nom) {
        const b = await benevoleRepository.findByName(nom);
        if (!b) throw new Error("Bénévole avec ce nom non trouvé.");
        return this._formatBenevole(b);
    }

    /**
     * @desc    Mettre à jour un bénévole (Admin seul)
     */
    async updateBenevole(id, updateData) {
        const { nom, email, mession, disponibilite, status } = updateData;

        return await sequelize.transaction(async (t) => {
            const user = await benevoleRepository.findById(id);
            if (!user) throw new Error("Bénévole non trouvé.");

            if (email && email !== user.email) {
                const existing = await benevoleRepository.findByEmail(email);
                if (existing) throw new Error("Email déjà utilisé.");
                user.email = email;
            }

            if (nom) user.nom = nom;
            if (mession) user.benevole.mession = mession;
            if (disponibilite) user.benevole.disponibilite = disponibilite;
            
            // Si une nouvelle photo est fournie, supprimer l'ancienne
            if (photo_profile && photo_profile !== user.benevole.photo_profile) {
                if (user.benevole.photo_profile && user.benevole.photo_profile !== 'null') {
                    try {
                        const oldPath = path.join(__dirname, '..', user.benevole.photo_profile);
                        if (fs.existsSync(oldPath)) {
                            fs.unlinkSync(oldPath);
                        }
                    } catch (err) {
                        console.error("Erreur suppression ancienne photo update : ", err.message);
                    }
                }
                user.benevole.photo_profile = photo_profile;
            }

            if (status) user.benevole.status = status;

            await user.benevole.save({ transaction: t });
            await user.save({ transaction: t });

            return this._formatBenevole(user);
        });
    }

    /**
     * @desc    Supprimer un bénévole (Admin seul)
     */
    async deleteBenevole(id) {
        const user = await benevoleRepository.findById(id);
        if (!user) throw new Error("Bénévole non trouvé.");

        // Supprimer la photo du disque si elle existe
        if (user.benevole && user.benevole.photo_profile && user.benevole.photo_profile !== 'null') {
            try {
                const filePath = path.join(__dirname, '..', user.benevole.photo_profile);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {
                console.error("Erreur lors de la suppression de la photo : ", err.message);
            }
        }

        await user.destroy();
        return true;
    }

    /**
     * Helper de formatage
     */
    _formatBenevole(b) {
        return {
            id: b.id,
            nom: b.nom,
            email: b.email,
            mession: b.benevole.mession,
            status: b.benevole.status,
            disponibilite: b.benevole.disponibilite,
            date_adhesion: b.benevole.date_adhesion,
            created_at: b.created_at
        };
    }
}

module.exports = new BenevoleService();
