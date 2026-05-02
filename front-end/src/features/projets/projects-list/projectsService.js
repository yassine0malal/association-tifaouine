import axios from "axios";


const BACK_END_API = import.meta.env.VITE_BASE_BACK_END_URL

export const fetchProjectsAPI = async (
  page = 1,
  filter = "all",
  lang = "fr",
) => {
  try {
    const res = await axios.get(`${BACK_END_API}/api/${lang}/projets?page=${page}?statut=${filter}`);
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
