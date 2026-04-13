import axios from "axios";

export const fetchProjectAPI = async (id , lang) => {
    try{
        const res = await axios.get(`/api/${lang}/project.json`);
        return res.data;
    }catch(err) {
        throw err;
    }
}