import axios from "axios";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

export const ressourcesAPI = async (page , lang) => {    
    try{
        const res = await axios.get(`${BASE_BACK_END_URL}/api/${lang}/ressources/documents`);
        // console.log("service--",res.data)
        // console.log(res.data.resourceLibrary.resources)
        return res.data;
    }catch(error) {
        throw error;
    }
}

