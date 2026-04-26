import axios from "axios";


export const ressourcesAPI = async (page , lang) => {    
    try{
        console.log("service--",lang)
        const res = await axios.get(`/api/${lang}/ressources.json`);
        console.log(res.data.resourceLibrary.resources)
        return res.data;
    }catch(error) {
        throw error;
    }
}

