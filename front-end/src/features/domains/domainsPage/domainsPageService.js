import axios from "axios";
const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export const fetchDomainsPageApi = async (lang) => {
    try {
        const res = await axios.get(`${BASE_BACK_END_URL}/api/${lang}/domaines`);
        console.log("domaines part ,displaying ----> ", res.data);
        return res.data;
    } catch (err) {
        console.log("pay attention error " + err);
        throw err;
    }
};