import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { Typography, Box, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos, Loader } from "./";

import { useAuth } from "../auth/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { addToHistory, getUserHistory } from "../utils/userService";

import dataJson from "../utils/data.json";
import { getLocalRelatedVideos } from "../utils/fetchFromLocal";

const VideoDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();

  const passedVideo = location.state?.video || null;

  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setVideoDetail(null);
    setLoading(true);
  }, [id]);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        // Get video data from Firestore history
        if (user) {
          const historyRef = doc(db, "users", user.uid, "watch_history", id);
          const snapshot = await getDoc(historyRef);

          if (snapshot.exists()) {
            const videoDetails = snapshot.data();

            setVideoDetail({
              id: id,
              snippet: {
                publishedAt:
                  videoDetails.uploaded_at?.toDate?.() ||
                  videoDetails.uploaded_at,
                channelId: videoDetails.channel_id,
                title: videoDetails.title,
                thumbnails: {
                  high: { url: videoDetails.thumbnail },
                },
                channelTitle: videoDetails.channel_title,
              },
              contentDetails: {
                duration: videoDetails.duration || "00:00",
              },
              statistics: {
                viewCount: videoDetails.views || "0",
                likeCount: videoDetails.likes || "0",
              },
            });
            setLoading(false);
            return;
          }
        }

        // video data doesn't come from history - Fetch from YouTube API
        const data = await fetchFromAPI("videos", {
          part: "snippet,contentDetails,statistics",
          id,
        });
        const details = data?.items?.[0];
        if (details) {
          setVideoDetail(details);
          // Add it to history
          if (user) {
            await addToHistory(user.uid, details, id);
          }

          setLoading(false);
          return;
        }

        if (passedVideo && (passedVideo.id?.videoId === id || passedVideo.id === id)) {
          setVideoDetail(passedVideo);
          setLoading(false);
          return;
        }

        setVideoDetail(dataJson[0]);
        setLoading(false);
      } catch (err) {
        setVideoDetail(dataJson[0]);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [id, user]);

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      try {
        if (user) {
          const history = await getUserHistory(user.uid);
          if (history.length > 0) {
            setVideos(history);
            return;
          }
        }

        const localVideos = await getLocalRelatedVideos();
        if (localVideos?.length > 0) {
          setVideos(localVideos);
          return;
        }
      } catch (error) {
        setVideos(dataJson);
      }
    };
    fetchRelatedVideos();
  }, [id, user]);

  if (loading || !videoDetail?.snippet) return <Loader />;

  const { snippet, statistics } = videoDetail;
  const { title, channelId, channelTitle } = snippet || {};
  const { viewCount = 123, likeCount = 456 } = statistics || {};

  return (
    <Stack direction={{ xs: "column", md: "row" }} sx={{ alignItems: "flex-start" }}>

      <Box sx={{ width: "100%", position: { md: "sticky", xs: "static" }, top: "86px" }}>
        <ReactPlayer url={`https://www.youtube.com/watch?v=${videoDetail.id?.videoId || id}`}
          className="react-player" controls />

        <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
          {title}
        </Typography>

        <Stack direction="row" justifyContent="space-between" sx={{ color: "#fff" }} py={1} px={2}>

          <Link to={`/channel/${channelId}`}>
            <Typography variant={{ sm: "subtitle1", md: "h6" }} color="#fff">
              {channelTitle}
              <CheckCircleIcon sx={{ fontSize: "12px", color: "gray", ml: "5px" }} />
            </Typography>
          </Link>

          <Stack direction="row" gap="20px" alignItems="center">
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              {parseInt(viewCount).toLocaleString()} views
            </Typography>

            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              {parseInt(likeCount).toLocaleString()} likes
            </Typography>
          </Stack>

        </Stack>
        
      </Box>

      <Box px={2} py={{ md: 1, xs: 5 }} justifyContent="center" alignItems="center">
        <Videos videos={videos} direction="column" />
      </Box>

    </Stack>
  );
};

export default VideoDetail;
