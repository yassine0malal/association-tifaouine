import axios from "axios";
const apiUrl = import.meta.env.REACT_APP_API_URL;

export const fetchProjectsAPI = async (
  page = 1,
  filter = "all",
  lang = "fr",
) => {
  try {
    const res = await axios.get(`/api/${lang}/projects.json`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchProjectsForSelectAPI = async (lang = "fr") => {
  try {
    const res = await axios.get(`/api/${lang}/selectProjects.json`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
