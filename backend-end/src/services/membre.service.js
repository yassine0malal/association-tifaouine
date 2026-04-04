const { sequelize, Utilisateur, membre } = require('../models');
const membreRepository = require('../repositories/membre.repository');
const fs = require('fs');
const path = require('path');

class MembreService {
    /**
     * @desc    Créer un ou plusieurs membres dans une transaction
     * @param   {Array|Object} data - Données du/des membres
     */
    async createMembers(data) {
        // Normaliser les données en tableau
        const membersData = Array.isArray(data) ? data : [data];

        return await sequelize.transaction(async (t) => {
            const createdResults = [];

            for (const item of membersData) {
                const { nom, email, poste, photo_profile, status, date_adhesion } = item;

                // 1. Vérifier si l'email existe déjà
                const existingUser = await membreRepository.findByEmail(email);
                if (existingUser) {
                    throw new Error(`L'email ${email} est déjà utilisé.`);
                }

                // 2. Créer l'Utilisateur
                const user = await Utilisateur.create({
                    nom,
                    email,
                    type: 'membre'
                }, { transaction: t });

                // 3. Créer le profil Membre lié
                const memberProfile = await membre.create({
                    utilisateur_id: user.id,
                    poste: poste || 'membre',
                    photo_profile: photo_profile || null,
                    status: status || 'actif',
                    date_adhesion: date_adhesion || new Date()
                }, { transaction: t });

                createdResults.push({
                    id: user.id,
                    nom: user.nom,
                    email: user.email,
                    poste: memberProfile.poste,
                    status: memberProfile.status,
                    created_at: user.created_at
                });
            }

            return createdResults;
        });
    }

    /**
     * @desc    Récupérer la liste complète des membres
     */
    async getAllMembers() {
        const members = await membreRepository.findAll();
        return members.map(m => ({
            id: m.id,
            nom: m.nom,
            email: m.email,
            poste: m.membre.poste,
            status: m.membre.status,
            photo_profile: m.membre.photo_profile,
            date_adhesion: m.membre.date_adhesion
        }));
    }

    /**
     * @desc    Récupérer un membre par son Email
     */
    async getMemberByEmail(email) {
        const m = await membreRepository.findByEmail(email);
        if (!m) throw new Error("Membre avec cet email non trouvé.");
        return this._formatMember(m);
    }

    /**
     * @desc    Récupérer un membre par son Nom
     */
    async getMemberByName(nom) {
        const m = await membreRepository.findByName(nom);
        if (!m) throw new Error("Membre avec ce nom non trouvé.");
        return this._formatMember(m);
    }

    /**
     * @desc    Récupérer un membre par son ID
     */
    async getMemberById(id) {
        const m = await membreRepository.findById(id);
        if (!m) throw new Error("Membre avec cet ID non trouvé.");
        return this._formatMember(m);
    }

    /**
     * @desc    Mettre à jour un membre (Admin seul)
     */
    async updateMember(id, updateData) {
        const { nom, email, poste, photo_profile, status } = updateData;

        return await sequelize.transaction(async (t) => {
            const user = await membreRepository.findById(id);
            if (!user) throw new Error("Membre non trouvé.");

            if (email && email !== user.email) {
                const existing = await membreRepository.findByEmail(email);
                if (existing) throw new Error("Email déjà utilisé.");
                user.email = email;
            }

            if (nom) user.nom = nom;
            if (poste) user.membre.poste = poste;
            
            // Si une nouvelle photo est fournie, supprimer l'ancienne
            if (photo_profile && photo_profile !== user.membre.photo_profile) {
                if (user.membre.photo_profile && user.membre.photo_profile !== 'null') {
                    try {
                        const oldPath = path.join(__dirname, '..', user.membre.photo_profile);
                        if (fs.existsSync(oldPath)) {
                            fs.unlinkSync(oldPath);
                        }
                    } catch (err) {
                        console.error("Erreur suppression ancienne photo update : ", err.message);
                    }
                }
                user.membre.photo_profile = photo_profile;
            }

            if (status) user.membre.status = status;

            await user.membre.save({ transaction: t });
            await user.save({ transaction: t });

            return this._formatMember(user);
        });
    }

    /**
     * @desc    Supprimer un membre (Admin seul)
     */
    async deleteMember(id) {
        const user = await membreRepository.findById(id);
        if (!user) throw new Error("Membre non trouvé.");

        // Supprimer la photo du disque si elle existe
        if (user.membre && user.membre.photo_profile && user.membre.photo_profile !== 'null') {
            try {
                // Le chemin en base est /data/membres/... 
                // On doit le mapper au chemin physique src/data/membres/...
                const filePath = path.join(__dirname, '..', user.membre.photo_profile);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {
                console.error("Erreur lors de la suppression de la photo : ", err.message);
                // On continue quand même la suppression en base
            }
        }

        await user.destroy(); // Cascade via associations
        return true;
    }

    /**
     * Helper de formatage
     */
    _formatMember(m) {
        return {
            id: m.id,
            nom: m.nom,
            email: m.email,
            poste: m.membre.poste,
            status: m.membre.status,
            photo_profile: m.membre.photo_profile,
            date_adhesion: m.membre.date_adhesion,
            created_at: m.created_at
        };
    }
}

module.exports = new MembreService();
