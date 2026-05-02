const { sequelize, Utilisateur, membre, AdminNotification } = require('../models');
const membreRepository = require('../repositories/membre.repository');
const { toDemandeMembreDTO } = require('../dto/etreMembre.dto');

class EtreMembreService {
    /**
     * Traite une demande d'adhésion publique
     * @param {Object} body  - req.body validé
     * @param {Object} files - req.files (multer fields)
     */
    async soumettreDemande(body, files) {
        const dto = toDemandeMembreDTO(body, files);

        // Vérifier unicité email avant d'ouvrir la transaction
        const existing = await membreRepository.findByEmail(dto.utilisateur.email);
        if (existing) {
            throw new Error(`L'adresse email ${dto.utilisateur.email} est déjà associée à un compte.`);
        }

        return await sequelize.transaction(async (t) => {
            // 1. Créer l'utilisateur
            const user = await Utilisateur.create(dto.utilisateur, { transaction: t });

            // 2. Créer le profil membre avec tous les champs de la demande
            await membre.create({
                utilisateur_id: user.id,
                ...dto.membre
            }, { transaction: t });

            // 3. Notifier les admins
            await AdminNotification.create({
                type:      'DEMANDE_MEMBRE',
                entity_id: user.id,
                message:   `Nouvelle demande d'adhésion : ${user.nom} (${user.email})`
            }, { transaction: t });

            return { id: user.id, nom: user.nom, email: user.email };
        });
    }
}

module.exports = new EtreMembreService();
