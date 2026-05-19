import { protectedApi } from "../Login/authService";

// Créer un nouveau partenaire (multipart/form-data)
export const createPartnerAPI = async (partnerData) => {
    // partnerData doit être une instance de FormData
    const res = await protectedApi.post(`/api/partenariats/admin`, partnerData);
    return res.data;
};

// Récupérer tous les partenaires
export const fetchAdminPartnersAPI = async () => {
    const res = await protectedApi.get(`/api/partenariats/admin/all`);
    return res.data;
};

// Supprimer un partenaire
export const deletePartnerAPI = async (id) => {
    const res = await protectedApi.delete(`/api/partenariats/admin/${id}`);
    return res.data;
};


export const fetchPartnerByIdAPI = async (id) => {
    const res = await protectedApi.get(`/api/partenariats/admin/${id}`);
    return res.data;
};

// Mettre à jour un partenaire (multipart/form-data car le logo peut changer)
export const updatePartnerAPI = async (id, partnerData) => {
    // partnerData est un FormData
    const res = await protectedApi.put(`/api/partenariats/admin/${id}`, partnerData);
    return res.data;
};