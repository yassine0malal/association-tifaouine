import axios from "axios";


export const fetchEventAPI = async (id) => {
    try{
        const res = await axios.get('/event.json')
        return res.data;
    }catch(error) {
        throw error;
    }
}