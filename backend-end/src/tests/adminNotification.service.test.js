/**
 * 🧪 Test Unitaire : AdminNotificationService
 * Utilise le module 'node:test' natif de Node.js v18+
 */
const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

// Mocks
const adminNotificationRepository = require('../repositories/adminNotification.repository');
const adminNotificationService = require('../services/adminNotification.service');

describe('--- Test de AdminNotificationService ---', () => {

    // On sauvegarde les fonctions d'origine pour pouvoir les restaurer ou les mocker
    const originalCreate = adminNotificationRepository.create;
    const originalFindAll = adminNotificationRepository.findAll;
    const originalUpdateStatus = adminNotificationRepository.updateStatus;
    const originalCountUnread = adminNotificationRepository.countUnread;

    beforeEach(() => {
        // Nettoyage des mocks avant chaque test
        adminNotificationRepository.create = originalCreate;
        adminNotificationRepository.findAll = originalFindAll;
        adminNotificationRepository.updateStatus = originalUpdateStatus;
        adminNotificationRepository.countUnread = originalCountUnread;
    });

    describe('Fonction createNotification()', () => {
        it('devrait créer une notification avec succès', async () => {
            // Mock de la création
            adminNotificationRepository.create = async (data, t) => {
                return { id: 1, ...data, status: false, created_at: new Date() };
            };

            const data = {
                type: 'NOUVEAU_DON',
                entity_id: 123,
                message: 'Nouveau don de 100 MAD'
            };

            const result = await adminNotificationService.createNotification(data);

            assert.strictEqual(result.id, 1);
            assert.strictEqual(result.type, 'NOUVEAU_DON');
            assert.strictEqual(result.entity_id, 123);
            assert.strictEqual(result.message, 'Nouveau don de 100 MAD');
            assert.strictEqual(result.status, false);
        });
    });

    describe('Fonction getAllNotifications()', () => {
        it('devrait retourner la liste des notifications et le compte', async () => {
            // Mock de findAll
            adminNotificationRepository.findAll = async (filters) => {
                return {
                    count: 2,
                    rows: [
                        { id: 1, type: 'NOUVEAU_DON', status: false },
                        { id: 2, type: 'NOUVEAU_MEMBRE', status: true }
                    ]
                };
            };

            const result = await adminNotificationService.getAllNotifications();
            assert.strictEqual(result.count, 2);
            assert.strictEqual(result.rows.length, 2);
            assert.strictEqual(result.rows[0].type, 'NOUVEAU_DON');
        });
    });

    describe('Fonction markAsRead()', () => {
        it('devrait marquer une notification comme lue avec succès', async () => {
            // Mock de updateStatus
            adminNotificationRepository.updateStatus = async (id, status) => {
                if (id === 1) {
                    return { id: 1, status: status };
                }
                return null;
            };

            const result = await adminNotificationService.markAsRead(1);
            assert.strictEqual(result.id, 1);
            assert.strictEqual(result.status, true);
        });

        it('devrait jeter une erreur si la notification n\'existe pas', async () => {
            // Mock de updateStatus pour retourner null
            adminNotificationRepository.updateStatus = async (id, status) => null;

            await assert.rejects(
                async () => await adminNotificationService.markAsRead(999),
                { message: 'Notification non trouvée' }
            );
        });
    });

    describe('Fonction getUnreadCount()', () => {
        it('devrait retourner le nombre exact de notifications non lues', async () => {
            // Mock de countUnread
            adminNotificationRepository.countUnread = async () => 5;

            const count = await adminNotificationService.getUnreadCount();
            assert.strictEqual(count, 5);
        });
    });

});