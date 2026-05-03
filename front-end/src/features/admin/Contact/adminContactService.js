import { protectedApi } from "../Login/authService";

export const fetchAdminContactAPI = async () => {
    const res = await protectedApi.get(`/api/messages`);
    console.info(res.data)
    return res.data;
};

export const deleteContactAPI = async (id) => {
    const res = await protectedApi.delete(`/api/messages/${id}`);
    return res.data;
};

// On ajoute le payload { lu } pour que le backend sache quoi modifier
export const updateContactStatusAPI = async (id, lu) => {
    const res = await protectedApi.put(`/api/messages/${id}`, { lu });
    return res.data;
};