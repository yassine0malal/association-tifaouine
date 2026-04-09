import axios from "axios";
const apiUrl = import.meta.env.REACT_APP_API_URL;

export const fetchProjectsAPI = async (page , filter) => {
    try{
        const res = await axios.get(`http://localhost:5173/projects.json`);
        return res.data;
    }catch(err) {
        console.log(err);
        throw err;
    }
};