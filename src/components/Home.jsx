import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../css/Home.css";

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function MapComponent({ position, setShowOverlay }) {
  const map = useMap();

  useEffect(() => {
    // Disable default scroll zoom behavior
    map.scrollWheelZoom.disable();

    const handleScroll = (e) => {
      if (e.target.closest('.leaflet-container')) {
        if (!e.ctrlKey) {
          e.preventDefault();
          setShowOverlay(true);
          setTimeout(() => setShowOverlay(false), 1000);
        } else {
          e.preventDefault(); // Prevent page zoom
          map.scrollWheelZoom.enable();
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Control') {
        map.scrollWheelZoom.disable();
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [map, setShowOverlay]);

  return null;
}

export default function Home() {
  const position = [45.4318, -75.5653]; // Coordinates for Ottawa
  const [showOverlay, setShowOverlay] = useState(false);

  const handleMarkerClick = () => {
    window.open("https://www.google.com/maps/place/Atelier+Rosso+Desserterie/@45.4318857,-75.5680077,17z/data=!3m1!4b1!4m6!3m5!1s0x4cce0f007bd3f921:0xa59f8803263d9deb!8m2!3d45.4318857!4d-75.5654328!16s%2Fg%2F11ln52cxc7?entry=ttu&g_ep=EgoyMDI0MDgyMS4wIKXMDSoASAFQAw%3D%3D", "_blank");
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Insert image? Or whatever else</h1>
        </div>
      </section>
      <section className="about">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
        </div>
      </section>
      <section className="gelato">
        <div className="text">
          <h2>Gelato</h2>
          <h3>Made In House</h3>
          <p className="confined-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
        </div>
        <div className="image">
          <img src="/images/gelato.jpg" alt="Gelato" />
        </div>
      </section>
      <section className="pastries">
        <div className="image">
          <img src="/images/pastries.jpg" alt="Pastries" />
        </div>
        <div className="text">
          <h2>Pastries</h2>
          <h3>Freshly Baked on the Daily</h3>
          <p className="confined-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
        </div>
      </section>
      <section className="map" id="map-section">
        <div className="map-container">
          <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} eventHandlers={{ click: handleMarkerClick }}>
            </Marker>
            <MapComponent position={position} setShowOverlay={setShowOverlay} />
          </MapContainer>
          {showOverlay && <div className="map-overlay">Ctrl + Scroll to zoom in and out</div>}
        </div>
      </section>
      <section className="contact">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Contact Us</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="location-info">
            <h2>Location</h2>
            <p>110 Bearbrook Rd #2B</p>
            <p>Ottawa, ON K1B 5R2</p>
          </div>
        </div>
      </section>
    </div>
  );
}