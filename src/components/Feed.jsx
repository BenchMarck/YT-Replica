import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import {useAuth} from "../auth/AuthContext";
import { shuffleArray } from "../utils/HelperFunctions";
import { getFromLocal } from "../utils/fetchFromLocal";
import { Videos, Sidebar, Loader } from "./";

const Feed = () => {
  const { showCategoryNames } = useOutletContext(); // get from MainLayout
  const [selectedCategory, setSelectedCategory] = useState("Home");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    setLoading(true);
    getFromLocal("search", { selected: selectedCategory })
    .then((data) => { setVideos(shuffleArray(data.items)); setLoading(false); });
  }, [selectedCategory]);
  
  if (loading) return <Loader />;

  return (
    <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
      <Box sx={{ position: {md:"sticky"}, top: {md:75}, zIndex: {md:1},
       height: { sx: "auto", md: "92vh" }, borderRight: "1px solid #3d3d3d", px: { sx: 0, md: 2 } }}>
        <Sidebar selectedCategory={selectedCategory} setSelectedCategory={handleCategorySelect} showCategoryNames={showCategoryNames} />
      </Box>
      
      <Box p={2} sx={{ /*overflowY: "auto", height: "90vh",*/ flex: 2 }}>
        <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>          
          {selectedCategory === "Home" ? 
            (profile ? <>Bienvenido, <span style={{ color: "#FC1503" }}>{profile.username.split("-")[0]}</span></> : "Bienvenido") 
          
            : <>
            <YouTubeIcon sx={{ color: "white", marginRight: "5px", marginBottom: "3px" }} />
            {selectedCategory} <span style={{ color: "#FC1503" }}> | videos</span>
          </>}
        </Typography>
        {videos?.length > 0 ? <Videos videos={videos} /> : <p>no videos found</p>}
      </Box>
    </Stack>
  );
};

export default Feed;
