import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { updateHistoryField, formatDuration } from "../utils/userService";
import Loader from "./Loader";
import { Tooltip } from "@mui/material";

import { Typography, Card, CardContent, CardMedia, Box, IconButton, } from "@mui/material";

import { demoVideoID, demoVideoTitle, demoThumbnailUrl, demoChannelID, demoChannelTitle, } from "../utils/constants";

const VideoCard = ({ video }) => {
  const { user } = useAuth();
  if (!video) return <Loader />;
  
  
  const videoId = video.id?.videoId || video.video_id || video.id || demoVideoID;
  const snippet = video.snippet || {};
  const title = snippet?.title || video.title || demoVideoTitle
  const thumbnail = snippet?.thumbnails?.high?.url || video.thumbnail || demoThumbnailUrl
  const channelId = snippet?.channelId || video.channel_id || demoChannelID
  const channelTitle = snippet?.channelTitle || video.channel_title || demoChannelTitle
  const timestamp = snippet?.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString() : video.uploaded_at || "12/31/1999";

  // If the API includes these fields (e.g., when using "videos?part=snippet,contentDetails,statistics")
  const rawDuration = video.contentDetails?.duration || video.duration;
  const duration = formatDuration(rawDuration);
  const views = video.statistics?.viewCount || video.views;

  return (
    <Card
      sx={{
        width: { xs: "320px", sm: "340px", md: "320px" },
        height: 290,
        boxShadow: "none",
        borderRadius: 2,
        bgcolor: "#1E1E1E",
        transition: "transform 0.3s ease",
        "&:hover .thumbnail": {
          transform: "scale(1.05)",
        },
        "&:hover .options-btn": {
          opacity: 1,
        },
      }}
    >
        <Link 
  to={`/video/${videoId}`}
  state={{ video }}   // preserve your state passing
  style={{ textDecoration: "none" }}
  onClick={async () => {
    if (user) {
      try {
        const res = await updateHistoryField(user.uid, videoId);
      } catch (err) {
      }
    }
  }}
>
        <Box 
          sx={{
            cursor: "pointer",
            position: "relative",
            //overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <CardMedia
            image={ thumbnail }
            alt={title}
            className="thumbnail"
            sx={{
              width: { xs: "100%", sm: "320px" },
              height: 180,
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
          />

          {duration && (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                bgcolor: "rgba(0,0,0,0.7)",
                color: "white",
                px: 0.8,
                py: 0.2,
                borderRadius: "4px",
                fontSize: "0.75rem",
              }}
            >
              {duration}
            </Box>
          )}
        </Box>
        </Link>

      <CardContent sx={{ backgroundColor: "#1E1E1E", height: "110px" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Link 
  to={`/video/${videoId}`}
  state={{ video }}   // preserve your state passing
  style={{ textDecoration: "none" }}
  onClick={async () => {
    if (user) {
      try {
        const res = await updateHistoryField(user.uid, videoId);
      } catch (err) {
      }
    }
  }}
>
            <Box>
              <Tooltip title={title} arrow placement="top"
                slotProps={{ tooltip:
                  { sx: { textAlign: "center",
                    maxWidth: 250,
                    //bgcolor: "green",
                    //color: "black",
                  }}
                }}
              >
              <Typography
                //variant="subtitle1"
                fontWeight="bold"
                color="#FFF"
                sx={{
                  cursor: "pointer",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  mx: "auto",
                  width: "100%",
                  ":hover": {textDecoration: "underline"}
                }}
                >
                {title}
              </Typography>
              </Tooltip>
            </Box>
           
            </Link>
            <Link to={ `/channel/${channelId}` }>
              <Typography
                variant="subtitle2"
                color="gray"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  mt: 0.3,
                  ":hover": { color: "red", WebkitLineClamp: 2 }
                }}
              >
                {channelTitle}
              </Typography>
            </Link>

            {(views || timestamp) && (
              <Typography
                variant="caption"
                color="gray"
                sx={{ display: "block", mt: 0.5 }}
              >
                {views && `${Number(views).toLocaleString()} views`}
                {views && timestamp && " · "}
                {timestamp}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
