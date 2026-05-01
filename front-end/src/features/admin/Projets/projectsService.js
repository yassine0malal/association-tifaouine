
import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_BACK_END_URL;

export const fetchProjectsAdminAPI = async (page = 1, filter = "all", lang = "fr") => {
    try {
        // Use the apiUrl variable you defined above
        const res = await axios.get(`${apiUrl}/api/${lang}/projet-admin`, {
            params: { page, filter } // Pass parameters properly
        });
        // console.warn("project $$$$$", res.data);
        return res.data;
    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
};