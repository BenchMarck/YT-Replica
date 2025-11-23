import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button, TextField, Slider } from "@mui/material";
import { greenIcon } from "../utils/constants";
import { useAuth } from "../auth/AuthContext";
import { useMap } from "../context/MapContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const AdvancedSearchPanel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { mapInstance, mapRef } = useMap();

  const [coords, setCoords] = useState(null);
  const [radius, setRadius] = useState(1000);

  const markerRef = useRef(null);
  const circleRef = useRef(null);

  const statusRef = useRef(null);
  const radiusRef = useRef(radius);

  const [keyword, setKeyword] = useState("");
  const [focused, setFocused] = useState(false);
  const label = focused || keyword ? "Búsqueda" : "Filtrar (Opcional...)";
  const [locationData, setLocationData] = useState(null);

  const { btnLoading } = useAuth();

  useEffect(() => {
    radiusRef.current = radius;
  }, [radius]); // only update if radius changes

  useEffect(() => {
    const saved = localStorage.getItem("lastLocation");
    if (saved) {
      const { lat, lng } = JSON.parse(saved);
      setCoords({ lat, lng });
      initMarker(lat, lng);
    }
  }, []);

  useEffect(() => {
    if (coords) localStorage.setItem("lastLocation", JSON.stringify(coords));
  }, [coords]);

  const [locationHistory, setLocationHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("locationHistory");
      if (!saved || saved === "undefined" || saved === "null") return [];
      return JSON.parse(saved);
    } catch (err) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("locationHistory", JSON.stringify(locationHistory));
  }, [locationHistory]);

  useEffect(() => {
    const urlLat = parseFloat(searchParams.get("lat"));
    const urlLng = parseFloat(searchParams.get("lng"));
    if (!urlLat || !urlLng) return;

    setCoords({ lat: urlLat, lng: urlLng });
    initMarker(urlLat, urlLng);

    try {
      const saved = JSON.parse(localStorage.getItem("locationHistory") || "[]");
      setLocationHistory(saved);
    } catch {
      setLocationHistory([]);
    }
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

  const initMarker = (lat, lng) => {
    const map = mapInstance.current;
    if (!map) return;

    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }

    markerRef.current = L.marker([lat, lng], {
      draggable: true,
      icon: greenIcon,
    })
      .addTo(map)
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
        .catch(() => {
          status.textContent = "No se pudo determinar la ubicación.";
        });
    };

    const error = () => {
      status.textContent = "No fue posible conseguir tu ubicación";
    };

    if (!navigator.geolocation) {
      status.textContent =
        "La geolocalización no está soportada por tu navegador";
    } else {
      status.textContent = "Localizando…";
      setLocationData(null);
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  const searchVideos = () => {
    if (!coords) {
      alert("Por favor, obtén una ubicación primero.");
      return;
    }

    const { lat, lng } = coords;
    const radiusKm = `${(radius / 1000).toFixed(3)}km`;
    navigate(
      `/search-advanced?lat=${lat}&lng=${lng}&radius=${radiusKm}&q=${encodeURIComponent(
        keyword
      )}`
    );
  };

  return (
    <div className="w-full bg-white border-b border-gray-300 shadow-md pb-6 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-xl font-bold text-gray-800">
          Buscar por ubicación
        </h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Keyword + Buttons Row */}
        <div className="space-y-4">
          {/* Keyword Input + Search */}
          <div>
            <form
              className="flex flex-wrap items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                searchVideos();
              }}
            >
              <TextField
                label={label}
                variant="outlined"
                size="small"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="bg-white"
              />

              <Button
                variant="contained"
                type="submit"
                disabled={btnLoading}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
              >
                {btnLoading ? "Buscando..." : "Buscar"}
              </Button>
            </form>
          </div>

          {/* Location Buttons + Location Info */}
          <div className="flex flex-wrap gap-4 items-start">
            {/* Obtener ubicación */}
            <div>
              <Button
                variant="outlined"
                onClick={handleGetLocation}
                className="px-4 py-2 border border-red-600 text-red-600 font-semibold rounded-md hover:bg-red-100 transition"
              >
                Obtener ubicación
              </Button>

              {/* Status message */}
              <p ref={statusRef} className="mt-2 text-gray-500 text-sm"></p>
            </div>

            {/* Volver */}
            <div>
              <Button
                variant="outlined"
                onClick={handleGoBack}
                disabled={locationHistory?.length < 2}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition"
              >
                Volver
              </Button>
            </div>
          </div>
        </div>

        {/* Radius */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Radio (kilómetros):{" "}
            <span className="text-blue-500 font-semibold">
              {" "}
              {radius / 1000}
            </span>
          </label>

          <Slider
            value={radius}
            min={100}
            max={200000}
            step={100}
            onChange={handleRadiusChange}
            className="w-full"
          />
        </div>

        {/* Map Container */}
        <div
          ref={mapRef}
          className="w-full h-[400px] rounded-md overflow-hidden border border-gray-300"
        />
      </div>
    </div>
  );
};

export default AdvancedSearchPanel;
