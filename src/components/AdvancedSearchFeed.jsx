import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useMap } from "../context/MapContext";
import { useAuth } from "../auth/AuthContext";
import { videoIcon } from "../utils/constants";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos } from "./";
import L from "leaflet";

const SearchAdvancedFeed = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [allVideos, setAllVideos] = useState([]);
  const [videos, setVideos] = useState([]);

  const { setBtnLoading } = useAuth();

  const { mapInstance } = useMap();
  const videoMarkersRef = useRef([]);

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius");
  const qKeyword = searchParams.get("q");

  useEffect(() => {
    if (!lat || !lng || !radius) return;
    
    const fetchAdvancedVideos = async () => {  
      setBtnLoading(true);

      const map = mapInstance.current;
      if (map) {
        videoMarkersRef.current.forEach((m) => map.removeLayer(m));
        videoMarkersRef.current = [];
      }
      
      try {
        const searchRes = await fetchFromAPI("search", {
          part: "snippet",
          type: "video",
          location: `${lat},${lng}`,
          locationRadius: radius,
          q: qKeyword,
        });
        
        const videoIds = searchRes.items.map((v) => v.id.videoId).join(",");
        
        const videosRes = await fetchFromAPI("videos", {
          part: "snippet,recordingDetails",
          id: videoIds,
        });
        
        const rawVideos = videosRes.items || [];
        const geoVideos = rawVideos.filter(v => v.recordingDetails?.location);
        setAllVideos(rawVideos);
        setVideos(geoVideos);
        setBtnLoading(false);
        
        if (geoVideos?.length > 0) {
          const map = mapInstance.current;
          if (map) {
            videoMarkersRef.current.forEach((m) => map.removeLayer(m));
            videoMarkersRef.current = [];
            
            geoVideos.forEach((video) => {
              const loc = video.recordingDetails?.location;
              if (!loc) return;
              const marker = L.marker([loc.latitude, loc.longitude], { icon: videoIcon })
              .addTo(map)
              .bindPopup(`<strong>${video.snippet.title}</strong><br>${video.snippet.channelTitle}`);      
              videoMarkersRef.current.push(marker);
            });

            // center map around search location
            if (lat && lng) map.setView([lat, lng], 10);
          }
          const boxEl = document.getElementById("advanced-results");
          boxEl?.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }

      if (geoVideos?.length === 0) {
        const savedHistory = JSON.parse(localStorage.getItem("locationHistory") || "[]");
        const last = savedHistory[savedHistory.length - 2]; // previous location
        if (last) {
          const goBack = window.confirm("No se encontraron videos para esta área. ¿Deseas volver a tu ubicación anterior?");
          if (goBack) {
            localStorage.setItem("locationHistory", JSON.stringify(savedHistory.slice(0, -1)));
            const { lat, lng } = last;            
            navigate(
              `/search-advanced?lat=${lat}&lng=${lng}&radius=${radius}&q=${encodeURIComponent(qKeyword)}`,
              { replace: true }
            );
            return;
          }
        }
        
        const global = window.confirm("¿Deseas hacer una búsqueda global en lugar de esta área?");
        if (global) {
          if (!qKeyword || qKeyword.trim().length === 0) {
            alert("Por favor, introduce al menos una palabra para buscar");
            return;
          }
          navigate(`/search/${encodeURIComponent(qKeyword.trim())}`);
          return;
        }
        alert("No se encontró una ubicación anterior en el historial.");        
      }
    } catch (err) {
      alert("Error al obtener videos. Por favor, comprueba tu clave de API o cuota.",);
      setBtnLoading(false);
    }
  };
  
  fetchAdvancedVideos();

    return () => {
    const map = mapInstance.current;
    if (map) { 
      videoMarkersRef.current.forEach((m) => map.removeLayer(m));
      videoMarkersRef.current = [];
    }
  };

}, [lat, lng, radius, qKeyword]);

return (
<Box id="advanced-results" p={2} minHeight="95vh">
      <Typography variant="h4" fontWeight={900} color="white" mb={3}>
        Resultados de búsqueda avanzada {qKeyword!=""?(<span style={{ color: "#FC1503" }}>{`| ${qKeyword}`}</span>):""}
      </Typography>
    <Typography color="gray" mb={2}>
        Ubicación: {lat}, {lng} | Radio: {radius} | Búsqueda: {qKeyword || "—"}
    </Typography>
    {allVideos.length > 0 && (
      <Box mt={2}>
        <Typography variant="subtitle1" color="gray">
          {allVideos.length} videos encontrados
        </Typography>
        <Typography variant="subtitle2" color="gray">
          {videos.length} con coordenadas
        </Typography>
      </Box>
    )}
      <Box display="flex">
        <Box sx={{ mr: { sm: "100px" } }} />
        {videos?.length > 0 ? (
          <Videos videos={videos} />
        ) : (
          <Typography color="gray">No hay videos para mostrar</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SearchAdvancedFeed;
