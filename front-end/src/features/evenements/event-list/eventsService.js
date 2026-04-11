import axios from "axios";

export const fetchEventsAPI = async (page, filter) => {
  try {
    const res = await axios.get("/events.json");
    return res.data;
  } catch (error) {
    throw error;
  }
};
