import { createContext, useContext, useRef } from "react";

const MapContext = createContext(null);

export const MapProvider = ({ children }) => {
  
  const mapInstance = useRef(null);

  return (
    <MapContext.Provider value={mapInstance}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);
