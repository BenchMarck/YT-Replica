import axios from "axios";

export const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = import.meta.env.VITE_GOOGLE_YOUTUBE_API_KEY;

// https://www.googleapis.com/youtube/v3/search?maxResults=40&key=API_KEY&part=snippet&q=Music
export const fetchFromAPI = async (endpoint, extraParams = {}) => {
  const options = {
    params: {
      maxResults: 40,
      key: API_KEY,
      ...extraParams,
    },
  };
  try {
    const { data } = await axios.get(`${BASE_URL}/${endpoint}`, options);
    return data;
  } catch (error) {
    return { items: [] };
  }
};
