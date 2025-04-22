import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../css/Location.css";

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function MapComponent({ position, setShowOverlay }) {
  const map = useMap();

  React.useEffect(() => {
    map.scrollWheelZoom.disable();

    const handleScroll = (e) => {
      if (e.target.closest(".leaflet-container")) {
        if (!e.ctrlKey) {
          e.preventDefault();
          setShowOverlay(true);
          setTimeout(() => setShowOverlay(false), 1000);
        } else {
          e.preventDefault();
          map.scrollWheelZoom.enable();
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Control") {
        map.scrollWheelZoom.disable();
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [map, setShowOverlay]);

  return null;
}

export default function Location() {
  const position = [45.4318, -75.5653]; // Coordinates for Ottawa
  const [showOverlay, setShowOverlay] = useState(false);
  const [mapDimensions, setMapDimensions] = useState({ height: "50vh", width: "80%" });

  const handleMarkerClick = () => {
    window.open(
      "https://www.google.com/maps/place/Atelier+Rosso+Desserterie/@45.4318857,-75.5680077,17z/data=!3m1!4b1!4m6!3m5!1s0x4cce0f007bd3f921:0xa59f8803263d9deb!8m2!3d45.4318857!4d-75.5654328!16s%2Fg%2F11ln52cxc7?entry=ttu&g_ep=EgoyMDI0MDgyMS4wIKXMDSoASAFQAw%3D%3D",
      "_blank"
    );
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 425px)");

    const updateMapDimensions = () => {
      if (mediaQuery.matches) {
        setMapDimensions({ height: "30vh", width: "97.5%" });
      } else {
        setMapDimensions({ height: "60vh", width: "70%" });
      }
    };

    updateMapDimensions();

    mediaQuery.addEventListener("change", updateMapDimensions);

    return () => {
      mediaQuery.removeEventListener("change", updateMapDimensions);
    };
  }, []);

  return (
    <section className="location-section" id="location">
      <div className="location-header">
        <h1>Where to Find Us</h1>
      </div>
      <div className="map-container" id="map-section">
        <MapContainer
          key={`${mapDimensions.height}-${mapDimensions.width}`}
          center={position}
          zoom={13}
          className="map"
          style={{ height: mapDimensions.height, width: mapDimensions.width }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} eventHandlers={{ click: handleMarkerClick }} />
          <MapComponent position={position} setShowOverlay={setShowOverlay} />
        </MapContainer>
        {showOverlay && <div className="map-overlay">Ctrl + Scroll to zoom in and out</div>}
      </div>
    </section>
  );
}