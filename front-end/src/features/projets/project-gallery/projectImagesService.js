import axios from "axios";


export const projectImagesAPI = async (project , page) => {
    try{
        const res = await axios.get('/projectImages.json');
        return res.data;
    }catch(error) {
        throw error;
    }
}

