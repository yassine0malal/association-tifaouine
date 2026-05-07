import axios from "axios";


const apiUrl = import.meta.env.VITE_BASE_BACK_END_URL

// export const fetchProjectsAPI = async (
//   page = 1,
//   filter = "all",
//   lang = "fr",
// ) => {
//   try {
//     const res = await axios.get(`${BACK_END_API}/api/${lang}/projets?page=${page}?statut=${filter}`);
//     return res.data;
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

export const fetchProjectsForSelectAPI = async (lang = "fr") => {
  try {
    const res = await axios.get(`/api/${lang}/selectProjects.json`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};


export const fetchProjectsAPI = async (page = 1, filter = "all", lang = "fr") => {
    try {
        // Use the apiUrl variable you defined above
        const res = await axios.get(`${apiUrl}/api/${lang}/projets`, {
            params: { page, filter } // Pass parameters properly
        });
        // console.warn("project $$$$$", res.data);
        return res.data;
    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
};
