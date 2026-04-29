class AdminNotificationDTO {
    constructor(id, type, entity_id, status, message, created_at) {
        this.id = id;
        this.type = type;
        this.entity_id = entity_id;
        this.status = status;
        this.message = message;
        this.created_at = created_at;
    }
}

const toAdminNotificationDTO = (notification) => {
    return new AdminNotificationDTO(
        notification.id,
        notification.type,
        notification.entity_id,
        notification.status,
        notification.message,
        notification.created_at
    );
};

module.exports = {
    toAdminNotificationDTO
};