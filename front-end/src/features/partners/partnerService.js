import axios from "axios";

export const partnersAPI = async (lang) => {
    try {
        const res = await axios.get(`/api/${lang}/partners.json`);
        console.log("---->",res.data,"<-----")
        return res.data;
    } catch (error) {
        throw error
    }
}