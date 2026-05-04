import { protectedApi } from "../Login/authService";

export const fetchAbonnesAPI = async () => {
    const res = await protectedApi.get(`/api/abonnement/admin/abonnes`);
    // console.log("abonnes response:", res.data);
    return res.data;
};

export const fetchAbonnementStatsAPI = async () => {
    const res = await protectedApi.get(`/api/abonnement/admin/abonnes/stats`);
    return res.data;
};

export const deleteAbonneAPI = async (id) => {
    const res = await protectedApi.delete(`/api/abonnement/admin/abonnes/${id}`);
    return res.data;
};