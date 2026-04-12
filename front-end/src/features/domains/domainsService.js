import axios from "axios";
const apiUrl = import.meta.env.REACT_APP_API_URL;

export const fetchDomainsApi = async () => {
    try {
        const res = await axios.get(`http://localhost:5173/domains.json`);
        console.log("----service data" + res.data);
        return res.data;
    } catch (err) {
        console.log("pay attention error " + err);
        throw err;
    }
};