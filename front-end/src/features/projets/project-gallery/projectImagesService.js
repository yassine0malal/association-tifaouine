import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_BACK_END_URL || "http://localhost:3000/api";

export const projectImagesAPI = async (id = 1, page = 1, lang = "fr" ) => {
    
  try {
    const res = await axios.get(`${BASE_URL}/api/${lang}/projets/${id}/images`, {
      params: { page, limit: 3 },
    });

    console.log(res);
    
    return res.data;
  } catch (error) {
    throw error;
  }
};
