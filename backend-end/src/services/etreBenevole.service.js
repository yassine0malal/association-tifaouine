const { sequelize, Utilisateur, benevole, AdminNotification } = require('../models');
const benevoleRepository = require('../repositories/benevole.repository');
const { toDemandeBenevoleDTO } = require('../dto/etreBenevole.dto');

class EtreBenevoleService {
    /**
     * Traite une demande de bénévolat publique
     * @param {Object} body  - req.body validé
     * @param {Object} files - req.files (multer fields)
     */
    async soumettreDemande(body, files) {
        const dto = toDemandeBenevoleDTO(body, files);

        // Vérifier unicité email avant d'ouvrir la transaction
        const existing = await benevoleRepository.findByEmail(dto.utilisateur.email);
        if (existing) {
            throw new Error(`L'adresse email ${dto.utilisateur.email} est déjà associée à un compte.`);
        }

        return await sequelize.transaction(async (t) => {
            // 1. Créer l'utilisateur
            const user = await Utilisateur.create(dto.utilisateur, { transaction: t });

            // 2. Créer le profil bénévole avec tous les champs de la demande
            await benevole.create({
                utilisateur_id: user.id,
                ...dto.benevole
            }, { transaction: t });

            // 3. Notifier les admins
            await AdminNotification.create({
                type:      'DEMANDE_BENEVOLE',
                entity_id: user.id,
                message:   `Nouvelle demande de bénévolat : ${user.nom} (${user.email})`
            }, { transaction: t });

            return { id: user.id, nom: user.nom, email: user.email };
        });
    }
}

module.exports = new EtreBenevoleService();
