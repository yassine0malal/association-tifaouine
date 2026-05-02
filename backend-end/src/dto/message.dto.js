/**
 * DTO Message — retourne les champs nécessaires au frontend
 */

/**
 * DTO pour la liste des messages (pagination)
 */
const toMessageListDTO = (message) => ({
    id: message.id,
    nom_complet: message.nom_complet,
    email: message.email,
    objet: message.objet,
    message: message.message,
    lu: message.lu,
    date: message.created_at
});

/**
 * DTO pour les détails d'un message
 */
const toMessageDetailDTO = (message) => ({
    id: message.id,
    nom_complet: message.nom_complet,
    email: message.email,
    objet: message.objet,
    message: message.message,
    lu: message.lu,
    date_creation: message.created_at,
    date_modification: message.updated_at
});

/**
 * Transformer une liste de messages
 */
const toMessageListDTOs = (messages) => {
    return messages.map(message => toMessageListDTO(message));
};

module.exports = {
    toMessageListDTO,
    toMessageDetailDTO,
    toMessageListDTOs
};