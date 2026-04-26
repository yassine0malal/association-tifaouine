import axios from "axios";

export const fetchDomainsPageApi = async (lang) => {
    try {
        const res = await axios.get(`/api/${lang}/domainsPage.json`);
        return res.data;
    } catch (err) {
        console.log("pay attention error " + err);
        throw err;
    }
};