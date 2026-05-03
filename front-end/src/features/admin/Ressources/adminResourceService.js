import { protectedApi } from "../Login/authService";

// Fetch all resources (Association view)
export const fetchAdminResourcesAPI = async () => {
    // Using the specific endpoint provided
    const res = await protectedApi.get(`/api/ressources/association`);
    console.log("res ----",res.data)
    return res.data;
};

// Create a new resource (supports image/file upload)
export const createResourceAPI = async (resourceData) => {
    // resourceData must be FormData
    const res = await protectedApi.post(`/api/ressources`, resourceData);
    return res.data;
};

// Delete a resource
export const deleteResourceAPI = async (id) => {
    const res = await protectedApi.delete(`/api/ressources/${id}`);
    return res.data;
};

// Fetch a single resource by ID
export const fetchResourceByIdAPI = async (id) => {
    const res = await protectedApi.get(`/api/ressources/${id}`);
    return res.data;
};

// Update an existing resource
export const updateResourceAPI = async (id, resourceData) => {
    // resourceData must be FormData
    const res = await protectedApi.put(`/api/ressources/${id}`, resourceData);
    return res.data;
};