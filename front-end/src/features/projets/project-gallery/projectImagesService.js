import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const projectImagesAPI = async (id, page, lang) => {
    try {
        const res = await axios.get(`${BASE_URL}/${lang}/projets/${id}/images`, {
            params: { page, limit: 8 }
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};
