import axios from "axios";
const apiUrl = import.meta.env.REACT_APP_API_URL;

export const fetchProjectsAPI = async (page , filter) => {
    try{
        const res = await axios.get(`/projects.json`);
        return res.data;
    }catch(err) {
        throw err;
    }
};