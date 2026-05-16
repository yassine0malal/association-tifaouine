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
    const res = await axios.get(`${apiUrl}/api/${lang}/project-for-don`);
    return res.data;
  } catch (err) {
        console.error("API Error:", err);
    throw err;
  }
};


export const fetchProjectsAPI = async (page = 1, filter = "all", lang = "fr", limit = 6) => {
  
    try {
        // Use the apiUrl variable you defined above
        const res = await axios.get(`${apiUrl}/api/${lang}/projets`, {
            params: { page, statut:filter === "all" ? "" : filter, limit } // Pass parameters properly
        });
        return res.data;
    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
};
