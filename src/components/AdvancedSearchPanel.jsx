import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button, TextField, Typography, Slider } from "@mui/material";
import { greenIcon } from "../utils/constants";
import { useAuth } from "../auth/AuthContext";
import { useMap } from "../context/MapContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


const AdvancedSearchPanel = () => {
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
 
  const mapRef = useRef(null);
  const mapInstance = useMap();
  
  const [coords, setCoords] = useState(null);
  const [radius, setRadius] = useState(1000);

  const markerRef = useRef(null);
  const circleRef = useRef(null);

  const statusRef = useRef(null);
  const radiusRef = useRef(radius);
    
  const [keyword, setKeyword] = useState("");
  const [focused, setFocused] = useState(false);
  const label = focused || keyword ? "Búsqueda" : "Opcional...";
  const [locationData, setLocationData] = useState(null);
    
  const { btnLoading } = useAuth();

  
  useEffect(() => { radiusRef.current = radius; }, [radius]); // only update if radius changes
  
  useEffect(() => {
    const saved = localStorage.getItem("lastLocation");
    if (saved) {
      const { lat, lng } = JSON.parse(saved);
      setCoords({ lat, lng });
      initMarker(lat, lng);
    }
  }, []);

  useEffect(() => { if (coords) localStorage.setItem("lastLocation", JSON.stringify(coords)); }, [coords]);
  
  const [locationHistory, setLocationHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("locationHistory");
      if (!saved || saved === "undefined" || saved === "null") return [];
      return JSON.parse(saved);
    } catch (err) { return []; }
  });
  
  useEffect(() => { localStorage.setItem("locationHistory", JSON.stringify(locationHistory)); }, [locationHistory]);
  
  useEffect(() => {
    const urlLat = parseFloat(searchParams.get("lat"));
    const urlLng = parseFloat(searchParams.get("lng"));
    if (!urlLat || !urlLng) return;
  
    setCoords({ lat: urlLat, lng: urlLng });
    initMarker(urlLat, urlLng);
  
    try {
      const saved = JSON.parse(localStorage.getItem("locationHistory") || "[]");
      setLocationHistory(saved);
    } catch { setLocationHistory([]); }

  }, [searchParams]);
  
  const handleGoBack = () => {
    setLocationHistory((prev) => {
      if (prev.length < 2) return prev; // no previous
      const newHistory = [...prev];
      newHistory.pop(); // remove current
      const last = newHistory[newHistory.length - 1];
      setCoords(last);
      initMarker(last.lat, last.lng);
      return newHistory;
    });
  };


  // initialize map only once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    
    mapInstance.current = L.map(mapRef.current).setView([20, -99], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© https://github.com/gzmark",
    }).addTo(mapInstance.current);
    
    setTimeout(() => mapInstance.current.invalidateSize(), 100);
  
  }, []);
  
  const initMarker = (lat, lng) => {
    const map = mapInstance.current;
    if (!map) return;
    
    if (markerRef.current) { map.removeLayer(markerRef.current); }

    markerRef.current = L.marker([lat, lng], { draggable: true, icon: greenIcon }).addTo(map)
    .bindPopup("Arrastra para ajustar ubicación");

    drawCircle(lat, lng, radius);
    
    markerRef.current.on("drag", (e) => {
      const newPos = e.target.getLatLng();
      drawCircle(newPos.lat, newPos.lng, radiusRef.current);
    });
    
    markerRef.current.on("dragend", (e) => {
      const newPos = e.target.getLatLng();
      setCoords({ lat: newPos.lat, lng: newPos.lng });

      // Add to history stack
      setLocationHistory((prev) => {
      const updated = [...prev, { lat: newPos.lat, lng: newPos.lng }];
      return updated;
    });    
    drawCircle(newPos.lat, newPos.lng, radiusRef.current);
    });
    map.setView([lat, lng], 13); //Zoom in to the marker after it's added
  };
  
  const drawCircle = (lat, lng, rad) => {
    const map = mapInstance.current;
    if (!map) return;
    if (circleRef.current) map.removeLayer(circleRef.current);
    circleRef.current = L.circle([lat, lng], {
      color: "blue",
      fillColor: "#3f0",
      fillOpacity: 0.2,
      radius: rad,
    }).addTo(map);
  };
  
  const handleRadiusChange = (_, val) => {
    setRadius(val);
    if (markerRef.current) {
      const pos = markerRef.current.getLatLng();
      drawCircle(pos.lat, pos.lng, val);
    }
  };

  // ----------------------------------------------- < > ------------------------------------------------- //

  const handleGetLocation = () => {
    const status = statusRef.current;

    const success = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      
      setLocationHistory([{ lat: latitude, lng: longitude }]);
      
      const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      
      fetch(geoApiUrl)
        .then((res) => res.json())
        .then((data) => {
          setLocationData({
            city: data.locality || "Unknown",
            state: data.principalSubdivision || "Unknown",
            country: data.countryName || "Unknown",
            latitude,
            longitude,
          });
          setCoords({ lat: latitude, lng: longitude });
          initMarker(latitude, longitude);
          status.textContent = "";
        })
        .catch(() => { status.textContent = "No se pudo determinar la ubicación."; });
      };
      
      const error = () => { status.textContent = "No fue posible conseguir tu ubicación"; };
      
      if (!navigator.geolocation) {
        status.textContent = "La geolocalización no está soportada por tu navegador";
      } else {
        status.textContent = "Localizando…";
        setLocationData(null);
        navigator.geolocation.getCurrentPosition(success, error);
      }
    };

  const searchVideos = () => {
    if (!coords) { alert("Por favor, obtén una ubicación primero."); return; }

    const { lat, lng } = coords;
    const radiusKm = `${(radius / 1000).toFixed(3)}km`;
    navigate(`/search-advanced?lat=${lat}&lng=${lng}&radius=${radiusKm}&q=${encodeURIComponent(keyword)}`);
  };
  
  return (
  <Box p={2} bgcolor="#f9f9f9" borderRadius={2}>
    <Typography variant="h6" gutterBottom> Búsqueda avanzada por ubicación </Typography>
    <Box display="flex" gap={2} alignItems="center" mb={2}>  
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <form   onSubmit={(e) => { e.preventDefault(); searchVideos(); }}
          style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <TextField
          label={label}
          variant="outlined"
          size="small"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <Button variant="contained" type="submit" disabled={btnLoading}>
          {btnLoading ? "Buscando..." : "Buscar"}
        </Button>
        </form>
      </Box>

      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <Button variant="contained" onClick={handleGetLocation}> Obtener ubicación </Button>
        <p ref={statusRef} style={{ marginTop: "10px", color: "gray" }}></p>
        {locationData && (
          <Box
            className="flex flex-row gap-2 items-center"
            p={2}
            border="1px solid #ccc"
            borderRadius="8px"
            bgcolor="#f9f9f9"
          >
            <Typography variant="subtitle1" gutterBottom>
              <strong>Detalles de ubicación:</strong>
            </Typography>
            <Typography>
              <strong>Ciudad:</strong> {locationData.city}
            </Typography>
            <Typography>
              <strong>Estado:</strong> {locationData.state}
            </Typography>
            <Typography>
              <strong>País:</strong> {locationData.country}
            </Typography>
            <Typography>
              <strong>Latitud:</strong> {locationData.latitude}
            </Typography>
            <Typography>
              <strong>Longitud:</strong> {locationData.longitude}
            </Typography>
          </Box>
        )}
      </Box>
      <Box>
        <Button variant="outlined" onClick={handleGoBack} disabled={locationHistory?.length < 2} sx={{ marginBottom: "10px", color: "blue" }}>
  Volver
</Button>

      </Box>
    </Box>
    <Typography gutterBottom>Radio: {radius/1000} Kilómetros</Typography>
    <Slider value={radius} min={100} max={200000} step={100} onChange={handleRadiusChange} />
    <div id="map" ref={mapRef} style={{ height: "400px", width: "100%" }} />
  </Box>
  );
};

export default AdvancedSearchPanel;
