import { protectedApi } from "../Login/authService";

// Fetch resources with pagination and search support
export const fetchAdminResourcesAPI = async (params) => {
    const res = await protectedApi.get(`/api/ressources/association`, {
        params: {
            page: params?.page || 1,
            search: params?.search || "",
            limit: params?.limit || 9 // Matches your backend default
        }
    });
    return res.data;
};

export const createResourceAPI = async (resourceData) => {
    const res = await protectedApi.post(`/api/ressources`, resourceData);
    return res.data;
};

export const deleteResourceAPI = async (id) => {
    const res = await protectedApi.delete(`/api/ressources/${id}`);
    return res.data;
};

export const fetchResourceByIdAPI = async (id) => {
    const res = await protectedApi.get(`/api/ressources/association/${id}`);
    return res.data;
};

export const updateResourceAPI = async (id, resourceData) => {
    const res = await protectedApi.put(`/api/ressources/${id}`, resourceData);
    console.log("ddsdddd",res.data)
    return res.data;
};