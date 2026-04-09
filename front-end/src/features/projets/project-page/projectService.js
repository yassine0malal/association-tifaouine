import axios from "axios";

export const fetchProjectAPI = async (project) => {
    try{
        const res = await axios.get('/project.json');
        return res.data;
    }catch(err) {
        throw err;
    }
}