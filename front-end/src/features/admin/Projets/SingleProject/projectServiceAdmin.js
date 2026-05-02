import axios from "axios";
const VITE_BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL

export const fetchProjectSingleAdminAPI = async (id = 20, lang) => {
    try {
        const res = await axios.get(`${VITE_BASE_BACK_END_URL}/api/projets/complet/${id}`);
        console.warn("single ==> ", res.data);
        return res.data;
    } catch (err) {
        throw err;
    }
}
