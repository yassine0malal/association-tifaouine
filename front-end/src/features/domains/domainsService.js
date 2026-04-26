import axios from "axios";
const apiUrl = import.meta.env.REACT_APP_API_URL;

export const fetchDomainsApi = async (lang) => {
    try {
        const res = await axios.get(`/api/${lang}/domains.json`);
        // console.log("service -->" + JSON.stringify(res.data, null,2));
        return res.data;
    } catch (err) {
        console.log("pay attention error " + err);
        throw err;
    }
};