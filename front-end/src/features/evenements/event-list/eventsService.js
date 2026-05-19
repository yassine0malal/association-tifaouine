import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_BACK_END_URL

export const fetchEventsAPI = async (page = 1, filter = "all", lang = "fr") => {
  try {
    const res = await axios.get(`${apiUrl}/api/${lang}/evenements`, {
      params: { page , domaine_id:filter === "all" ? '' : filter },
    });
    
    return res.data;
  } catch (error) {
    throw error;
  }
};
