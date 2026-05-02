import axios from "axios";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export const partenairesAPI = async (lang) => {
    try {
        const res = await axios.get(`${BASE_BACK_END_URL}/api/${lang}/partenariats-home`);
        console.log("----",res.data)
        return res.data;
    } catch (error) {
        throw error;
    }
};