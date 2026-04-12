import axios from "axios";


export const fetchEventAPI = async (id , lang) => {
    try{
        const res = await axios.get(`/api/${lang}/event.json`)
        return res.data;
    }catch(error) {
        throw error;
    }
}