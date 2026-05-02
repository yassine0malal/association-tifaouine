import axios from "axios";
const VITE_BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export const fetchAdminContactAPI = async () => {
    const res = await axios.get(`${VITE_BASE_BACK_END_URL}/api/messages`);
    return res.data; 
};

export const deleteContactAPI = async (id) => {
    const res = await axios.delete(`${VITE_BASE_BACK_END_URL}/api/fr/contacts/${id}`);
    return res.data;
};