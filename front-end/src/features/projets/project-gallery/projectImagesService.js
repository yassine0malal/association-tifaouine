import axios from "axios";


export const projectImagesAPI = async (id , page , lang) => {    
    try{
        const res = await axios.get(`/api/${lang}/projectImages.json`);
        return res.data;
    }catch(error) {
        throw error;
    }
}

