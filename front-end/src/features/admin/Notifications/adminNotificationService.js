import { protectedApi } from "../Login/authService";

export const fetchNotificationsAPI = async () => {
    const res = await protectedApi.get(`/api/admin/notifications`);
    return res.data;
};

export const getUnreadCountAPI = async () => {
    const res = await protectedApi.get(`/api/admin/notifications/unread-count`);
    return res.data;
};

export const markAsReadAPI = async (id) => {
    const res = await protectedApi.patch(`/api/admin/notifications/${id}/read`);
    return res.data;
};