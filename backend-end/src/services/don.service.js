const { sequelize } = require('../config/database');
const { AdminNotification } = require('../models');
const donRepository = require('../repositories/don.repository');
const { toDonListDTO, toDonDetailDTO } = require('../dto/don.dto');

const STATUTS_VALIDES    = ['recu', 'en_attente', 'traite'];
const TYPES_DEST_VALIDES = ['general', 'specifique'];

class DonService {

    /**
     * @desc    Créer un don financier — accès Public (visiteur du site)
     *          Statut initial : 'en_attente' (paiement à confirmer)
     */
    async createDonFinancier(data) {
        const { email, nom_complet, telephone, type_destination, projet_id, montant, devise, ref_transaction, message, recu } = data;

        if (!email || !nom_complet) {
            throw new Error("L'email et le nom complet sont obligatoires.");
        }
        if (!TYPES_DEST_VALIDES.includes(type_destination)) {
            throw new Error("Le type de destination doit être 'general' ou 'specifique'.");
        }
        if (type_destination === 'specifique' && !projet_id) {
            throw new Error("Un projet_id est requis pour un don spécifique.");
        }
        if (!montant || Number(montant) <= 0) {
            throw new Error("Un montant valide est obligatoire.");
        }

        return await sequelize.transaction(async (t) => {
            const don = await donRepository.createDon({
                email,
                nom_complet,
                telephone:        telephone || null,
                type_don:         'financier',
                type_destination,
                projet_id:        type_destination === 'specifique' ? projet_id : null,
                statut:           'en_attente',
                message:          message || null,
                date_reception:   new Date()
            }, { transaction: t });

            await donRepository.createDonFinancier({
                don_id:          don.id,
                montant:         Number(montant),
                devise:          devise || 'MAD',
                ref_transaction: ref_transaction || null,
                recu:            recu || null
            }, { transaction: t });

            // Notification pour Admin
            await AdminNotification.create({
                type: 'NOUVEAU_DON',
                entity_id: don.id,
                message: `Nouveau don financier de ${nom_complet} (${montant} ${devise || 'MAD'})`
            }, { transaction: t });

            const fullDon = await donRepository.findById(don.id, { transaction: t });
            return toDonDetailDTO(fullDon);
        });
    }

    /**
     * @desc    Enregistrer un don matériel reçu — accès Admin uniquement
     *          L'admin saisit un don physique déjà reçu (ex: 50 cartables)
     *          Statut initial : 'recu' (déjà en possession de l'association)
     */
    async createDonMateriel(data) {
        const { email, nom_complet, telephone, type_destination, projet_id, description, quantite, date_decision } = data;

        if (!email || !nom_complet) {
            throw new Error("L'email et le nom complet du donateur sont obligatoires.");
        }
        if (!TYPES_DEST_VALIDES.includes(type_destination)) {
            throw new Error("Le type de destination doit être 'general' ou 'specifique'.");
        }
        if (type_destination === 'specifique' && !projet_id) {
            throw new Error("Un projet_id est requis pour un don spécifique.");
        }
        if (!description) {
            throw new Error("La description du don matériel est obligatoire.");
        }

        return await sequelize.transaction(async (t) => {
            const don = await donRepository.createDon({
                email,
                nom_complet,
                telephone:        telephone || null,
                type_don:         'materiel',
                type_destination,
                projet_id:        type_destination === 'specifique' ? projet_id : null,
                statut:           'recu',
                date_reception:   new Date()
            }, { transaction: t });

            await donRepository.createDonMateriel({
                don_id:        don.id,
                description,
                quantite:      quantite || 1,
                date_decision: date_decision || null
            }, { transaction: t });

            const fullDon = await donRepository.findById(don.id, { transaction: t });
            return toDonDetailDTO(fullDon);
        });
    }

    /**
     * @desc    Récupérer tous les dons — Admin
     * @param   {Object} filters - type_don, statut, type_destination, projet_id
     */
    async getAllDons(filters = {}) {
        const result = await donRepository.findAll(filters);
        return { 
            rows:  result.rows.map(d => toDonListDTO(d)), 
            count: result.count 
        };
    }

    async getDonById(id) {
        const don = await donRepository.findById(id);
        if (!don) throw new Error(`Don avec l'ID ${id} introuvable.`);
        return toDonDetailDTO(don);
    }

    /**
     * @desc    Mettre à jour le statut d'un don — Admin
     *          Cas typique : passer un don financier de 'en_attente' à 'recu' après confirmation
     */
    async updateStatutDon(id, statut) {
        if (!STATUTS_VALIDES.includes(statut)) {
            throw new Error("Statut invalide. Valeurs acceptées : recu, en_attente, traite.");
        }
        const don = await donRepository.findById(id);
        if (!don) throw new Error(`Don avec l'ID ${id} introuvable.`);

        return await sequelize.transaction(async (t) => {
            const updated = await donRepository.updateStatut(id, statut, { transaction: t });
            return toDonDetailDTO(updated);
        });
    }

    /**
     * @desc    Supprimer un don — Admin
     */
    async deleteDon(id) {
        const don = await donRepository.findById(id);
        if (!don) throw new Error("Suppression impossible, ce don n'existe pas.");

        return await sequelize.transaction(async (t) => {
            await donRepository.delete(id, { transaction: t });
            return true;
        });
    }
}

module.exports = new DonService();
