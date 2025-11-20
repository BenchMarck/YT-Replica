import data from "../utils/data.json";
import redbull from "../utils/redbull.json";
import coding from "../utils/coding.json";
import music from "../utils/music.json";
import gaming from "../utils/gaming.json";
import sports from "../utils/sports.json";
import { shuffleArray, pickRandom } from "./HelperFunctions";

export const getFromLocal = async (endpoint, extraParams = {}) => {
  switch (endpoint) {
    case "search":
      if (extraParams.selected === "Home") return { items: data };
      if (extraParams.selected === "Red Bull") return { items: redbull };
      if (extraParams.selected === "Coding") return { items: coding };
      if (extraParams.selected === "Music") return { items: music };
      if (extraParams.selected === "Gaming") return { items: gaming };
      if (extraParams.selected === "Sports") return { items: sports };
    default: return { items: [] };
  }
};

export const getLocalRelatedVideos = async () => {
  const datasets = [data, redbull, coding, music, gaming, sports];
  // pick 5 from each dataset
  const related = datasets.flatMap((dataset) => pickRandom(dataset, 5));
  // final shuffle
  return shuffleArray(related);
};
