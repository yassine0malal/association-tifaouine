import axios from "axios";

export const fetchProjectsAPI = async (page , filter) => {
    try{
        const res = await axios.get(`projects.json`);
        return res.data;
    }catch(err) {
        console.log(err);
        throw err;
    }
};