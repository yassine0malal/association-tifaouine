const { sequelize, Utilisateur, benevole, AdminNotification } = require('../models');
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
                const { nom, email, mession, disponibilite, status, date_adhesion, photo_profile, carte_identite, telephone, competences, adresse, motivation } = item;

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
                    telephone: telephone || null,
                    competences: competences || null,
                    adresse: adresse || null,
                    motivation: motivation || null,
                    status: status || 'actif',
                    date_adhesion: date_adhesion || new Date(),
                    photo_profile: photo_profile || null,
                    carte_identite: carte_identite || null
                }, { transaction: t });

                // 4. Notification Admin
                await AdminNotification.create({
                    type: 'NOUVEAU_BENEVOLE',
                    entity_id: user.id,
                    message: `Nouvelle inscription bénévole: ${nom} (${email})`
                }, { transaction: t });

                createdResults.push({
                    id: user.id,
                    nom: user.nom,
                    email: user.email,
                    mession: benevoleProfile.mession,
                    status: benevoleProfile.status,
                    photo_profile: benevoleProfile.photo_profile,
                    carte_identite: benevoleProfile.carte_identite,
                    created_at: user.created_at
                });
            }

            return createdResults;
        });
    }

    /**
     * @desc    Récupérer tous les bénévoles
     */
    async getAllBenevoles(filters = {}) {
        const result = await benevoleRepository.findAll(filters);
        return { rows: result.rows.map(b => this._formatBenevole(b)), count: result.count };
    }

    async getAllBenevolesWithProfile(filters = {}) {
        return await benevoleRepository.findAll(filters);
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
        const { nom, email, mession, disponibilite, status, photo_profile, carte_identite, telephone, competences, adresse, motivation, date_adhesion } = updateData;

        return await sequelize.transaction(async (t) => {
            const user = await benevoleRepository.findById(id);
            if (!user) throw new Error("Bénévole non trouvé.");

            if (email && email !== user.email) {
                const existing = await benevoleRepository.findByEmail(email);
                if (existing) throw new Error("Email déjà utilisé.");
                user.email = email;
            }

            if (nom) user.nom = nom;
            if (mession !== undefined) user.benevole.mession = mession;
            if (disponibilite !== undefined) user.benevole.disponibilite = disponibilite;
            if (telephone !== undefined) user.benevole.telephone = telephone;
            if (competences !== undefined) user.benevole.competences = competences;
            if (adresse !== undefined) user.benevole.adresse = adresse;
            if (motivation !== undefined) user.benevole.motivation = motivation;
            if (date_adhesion !== undefined) user.benevole.date_adhesion = date_adhesion;
            
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

            // Si une nouvelle carte d'identité est fournie, supprimer l'ancienne
            if (carte_identite && carte_identite !== user.benevole.carte_identite) {
                if (user.benevole.carte_identite && user.benevole.carte_identite !== 'null') {
                    try {
                        const oldPath = path.join(__dirname, '..', user.benevole.carte_identite);
                        if (fs.existsSync(oldPath)) {
                            fs.unlinkSync(oldPath);
                        }
                    } catch (err) {
                        console.error("Erreur suppression ancienne carte identité update : ", err.message);
                    }
                }
                user.benevole.carte_identite = carte_identite;
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

        // Supprimer la carte d'identité du disque si elle existe
        if (user.benevole && user.benevole.carte_identite && user.benevole.carte_identite !== 'null') {
            try {
                const filePath = path.join(__dirname, '..', user.benevole.carte_identite);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {
                console.error("Erreur lors de la suppression de la carte d'identité : ", err.message);
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
            telephone: b.benevole.telephone,
            adresse: b.benevole.adresse,
            competences: b.benevole.competences,
            motivation: b.benevole.motivation,
            mession: b.benevole.mession,
            status: b.benevole.status,
            disponibilite: b.benevole.disponibilite,
            date_adhesion: b.benevole.date_adhesion,
            photo_profile: b.benevole.photo_profile,
            carte_identite: b.benevole.carte_identite,
            created_at: b.created_at
        };
    }
}

module.exports = new BenevoleService();
