import axios from "axios";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export const ressourcesAPI = async (page, lang, limit = 4) => {
    try {
        const res = await axios.get(`${BASE_BACK_END_URL}/api/${lang}/ressources/documents`, {
            params: { page, limit }
        });
        // console.log("*****************service--", res.data)
        return res.data;
    } catch (error) {
        throw error;
    }
}

