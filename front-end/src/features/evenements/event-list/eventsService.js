import axios from "axios";

export const fetchEventsAPI = async (page, filter , lang) => {
  console.log(lang);
  
  try {
    const res = await axios.get(`/api/${lang}/events.json`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
