import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_BACK_END_URL

export const fetchEventAPI = async (id , lang) => {
    const URL = `${apiUrl}/api/${lang}/evenements/${id}`
    try{
        const res = await axios.get(URL)
        return res.data;
    }catch(error) {
        throw error;
    }
}