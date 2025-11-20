import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { useParams } from "react-router-dom";

import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos, Loader } from "./";

const SearchFeed = () => {
  const { searchTerm } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchFromAPI("search", { part: "snippet", q: `${searchTerm} `})
    .then((data) => { setVideos(data.items); setLoading(false); });
  }, [searchTerm]);
  
  if (loading) return <Loader />;

  return (
    <Box p={2} minHeight="95vh">
      <Typography variant="h4" fontWeight={900}  color="white" mb={3} ml={{ sm: "100px"}}>
        Search Results for <span style={{ color: "#FC1503" }}>{searchTerm}</span> videos
      </Typography>
      <Box display="flex">
        <Box sx={{ mr: { sm: '100px' } }}/>
        {videos?.length > 0 ? <Videos videos={videos} /> : <p>no videos found</p>}
      </Box>
    </Box>
  );
};

export default SearchFeed;
