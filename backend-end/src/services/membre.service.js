const { sequelize, Utilisateur, membre, AdminNotification } = require('../models');
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
                const { nom, email, poste, photo_profile, carte_identite, cv, status, date_adhesion, description_poste_fr, description_poste_ar, description_poste_en, telephone, competences, adresse, motivation } = item;

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
                    description_poste_fr: description_poste_fr || null,
                    description_poste_ar: description_poste_ar || null,
                    description_poste_en: description_poste_en || null,
                    photo_profile: photo_profile || null,
                    carte_identite: carte_identite || null,
                    cv: cv || null,
                    telephone: telephone || null,
                    competences: competences || null,
                    adresse: adresse || null,
                    motivation: motivation || null,
                    status: status || 'actif',
                    date_adhesion: date_adhesion || new Date()
                }, { transaction: t });

                // 4. Créer la notification Admin
                await AdminNotification.create({
                    type: 'NOUVEAU_MEMBRE',
                    entity_id: user.id,
                    message: `Nouvelle inscription membre: ${nom} (${email})`
                }, { transaction: t });

                createdResults.push({
                    id: user.id,
                    nom: user.nom,
                    email: user.email,
                    poste: memberProfile.poste,
                    status: memberProfile.status,
                    photo_profile: memberProfile.photo_profile,
                    carte_identite: memberProfile.carte_identite,
                    cv: memberProfile.cv,
                    created_at: user.created_at
                });
            }

            return createdResults;
        });
    }

    /**
     * @desc    Récupérer la liste complète des membres
     */
    async getAllMembers(filters ={}) {
        const result = await membreRepository.findAll(filters);
        return { rows: result.rows.map(m => this._formatMember(m)), count: result.count };
    }

    async getAllMembresWithProfile(filters = {}) {
        return await membreRepository.findAll(filters);
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
        const { nom, email, poste, photo_profile, carte_identite, cv, status, date_adhesion, description_poste_fr, description_poste_ar, description_poste_en, telephone, competences, adresse, motivation } = updateData;

        return await sequelize.transaction(async (t) => {
            const user = await membreRepository.findById(id);
            if (!user) throw new Error("Membre non trouvé.");

            if (email && email !== user.email) {
                const existing = await membreRepository.findByEmail(email);
                if (existing) throw new Error("Email déjà utilisé.");
                user.email = email;
            }

            if (nom) user.nom = nom;
            if (poste !== undefined) user.membre.poste = poste;
            if (description_poste_fr !== undefined) user.membre.description_poste_fr = description_poste_fr;
            if (description_poste_ar !== undefined) user.membre.description_poste_ar = description_poste_ar;
            if (description_poste_en !== undefined) user.membre.description_poste_en = description_poste_en;
            if (telephone !== undefined) user.membre.telephone = telephone;
            if (competences !== undefined) user.membre.competences = competences;
            if (adresse !== undefined) user.membre.adresse = adresse;
            if (motivation !== undefined) user.membre.motivation = motivation;
            if (date_adhesion !== undefined) user.membre.date_adhesion = date_adhesion;
            
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

            // Fichier: carte_identite
            if (carte_identite && carte_identite !== user.membre.carte_identite) {
                if (user.membre.carte_identite && user.membre.carte_identite !== 'null') {
                    try {
                        const oldPath = path.join(__dirname, '..', user.membre.carte_identite);
                        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                    } catch (err) {}
                }
                user.membre.carte_identite = carte_identite;
            }

            // Fichier: cv
            if (cv && cv !== user.membre.cv) {
                if (user.membre.cv && user.membre.cv !== 'null') {
                    try {
                        const oldPath = path.join(__dirname, '..', user.membre.cv);
                        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                    } catch (err) {}
                }
                user.membre.cv = cv;
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

        // Supprimer les fichiers du disque s'ils existent
        const fileFields = ['photo_profile', 'carte_identite', 'cv'];
        for (const field of fileFields) {
            if (user.membre && user.membre[field] && user.membre[field] !== 'null') {
                try {
                    const filePath = path.join(__dirname, '..', user.membre[field]);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                } catch (err) {
                    console.error(`Erreur lors de la suppression du fichier ${field} : `, err.message);
                }
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
            description_poste_fr: m.membre.description_poste_fr,
            description_poste_ar: m.membre.description_poste_ar,
            description_poste_en: m.membre.description_poste_en,
            telephone: m.membre.telephone,
            adresse: m.membre.adresse,
            competences: m.membre.competences,
            motivation: m.membre.motivation,
            status: m.membre.status,
            photo_profile: m.membre.photo_profile,
            carte_identite: m.membre.carte_identite,
            cv: m.membre.cv,
            date_adhesion: m.membre.date_adhesion,
            created_at: m.created_at
        };
    }
}

module.exports = new MembreService();
