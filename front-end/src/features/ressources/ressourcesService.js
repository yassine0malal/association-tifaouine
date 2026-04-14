import axios from "axios";


export const ressourcesAPI = async (id , page , lang) => {    
    try{
        const res = await axios.get(`/api/${lang}/ressources.json`);
        return res.data;
    }catch(error) {
        throw error;
    }
}

