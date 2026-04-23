import axios from "axios";
const BASE_BACK_END_URL = "http://localhost:5000";
export const partnersAPI = async (lang) => {
    try {
        const res = await axios.get(`${BASE_BACK_END_URL}/api/${lang}/partenariats`);
        console.log("---->",res.data,"<-----")
        return res.data;
    } catch (error) {
        throw error
    }
}