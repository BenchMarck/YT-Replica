import React from "react";
import { Stack, Box } from "@mui/material";
import { ChannelCard, Loader, VideoCard } from "./";

const Videos = ({ videos, direction }) => {
  
  if (!videos) return <Loader />; // videos is at least an empty array
  
  const filtered = videos.filter((item) => item.id?.videoId || typeof item.id === "string" || item.id?.channelId);
  
  return (
    <Stack direction={direction || "row"} flexWrap="wrap" justifyContent="start" alignItems="start" gap={2}>
      {filtered.map((item, idx) => (
        <Box key={idx}>
          {(item.id?.videoId || typeof item.id === "string") && <VideoCard video={item} />}
          {item.id?.channelId && <ChannelCard channelDetail={item} />}
        </Box>
      ))}
    </Stack>
  );
}

export default Videos;
