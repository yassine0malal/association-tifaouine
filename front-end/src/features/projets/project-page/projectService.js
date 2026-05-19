import axios from "axios";


const apiUrl = import.meta.env.VITE_BASE_BACK_END_URL


export const fetchProjectAPI = async (id = 1 , lang = 'fr') => {
    const URL = `${apiUrl}/api/${lang}/projets/${id}`
    try{
        const res = await axios.get(URL);
        return res.data;
    }catch(err) {
        throw err;
    }
}