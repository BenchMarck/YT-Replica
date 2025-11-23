import { createContext, useContext, useRef, useEffect } from "react";

const MapContext = createContext(null);

export const MapProvider = ({ children }) => {
  
  const mapInstance = useRef(null);
  const mapRef = useRef(null);

  // initialize map only once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView([20, -99], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© https://github.com/gzmark",
    }).addTo(mapInstance.current);

    setTimeout(() => mapInstance.current.invalidateSize(), 200);
  }, []);

  return (
    <MapContext.Provider value={{ mapInstance, mapRef }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);
