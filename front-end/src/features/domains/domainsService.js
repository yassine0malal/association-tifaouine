import axios from "axios";
const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;
export const fetchDomainsApi = async (lang="fr") => {
    try {
        const res = await axios.get(`${BASE_BACK_END_URL}/api/${lang}/domaines-navbar`);
        // console.log("service -->" + JSON.stringify(res.data, null,2));
        return res.data;
    } catch (err) {
        console.log("pay attention error " + err);
        throw err;
    }
};