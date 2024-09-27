import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
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

  const gelatoTextRef = useRef(null);
  const pastriesTextRef = useRef(null);
  const gelatoImageRef = useRef(null);
  const pastriesImageRef = useRef(null);


  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (gelatoTextRef.current) observer.observe(gelatoTextRef.current);
    if (pastriesTextRef.current) observer.observe(pastriesTextRef.current);
    if (gelatoImageRef.current) observer.observe(gelatoImageRef.current);
    if (pastriesImageRef.current) observer.observe(pastriesImageRef.current);

    return () => {
      if (gelatoTextRef.current) observer.unobserve(gelatoTextRef.current);
      if (pastriesTextRef.current) observer.unobserve(pastriesTextRef.current);
      if (gelatoImageRef.current) observer.unobserve(gelatoImageRef.current);
      if (pastriesImageRef.current) observer.unobserve(pastriesImageRef.current);
    };
  }, []);

  const handleMarkerClick = () => {
    window.open("https://www.google.com/maps/place/Atelier+Rosso+Desserterie/@45.4318857,-75.5680077,17z/data=!3m1!4b1!4m6!3m5!1s0x4cce0f007bd3f921:0xa59f8803263d9deb!8m2!3d45.4318857!4d-75.5654328!16s%2Fg%2F11ln52cxc7?entry=ttu&g_ep=EgoyMDI0MDgyMS4wIKXMDSoASAFQAw%3D%3D", "_blank");
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="text">
            <h1>Delight in Every Bite!</h1>
            <p>Experience the ultimate indulgence with our flat croissants! Crispy, sweet, and utterly irresistible, each bite promises a symphony of flavors. Visit our shop and treat yourself to a crunch like no other!</p>
            <button onClick={handleMarkerClick} className="hero-button">Get That Crunch</button>
          </div>
          <div className="image">
            <img src="/images/flatcroissant.jpeg" alt="Hero" />
          </div>
        </div>
      </section>
      <section className="about">
        <div className="about-content">
          <h2>About Us (Placeholder - WIP)</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
        </div>
      </section>
      <section className="gelato">
        <div className="text" ref={gelatoTextRef}>
          <h2>Gelato</h2>
          <h3>Made In House</h3>
          <p className="confined-text">
            Indulge in our exquisite gelato, crafted in-house with the finest ingredients. We offer a variety of flavors with set classics and new flavors rotating in and out, ensuring there's always something to delight your taste buds and curiosity.
          </p>
        </div>
        <div className="image" ref={gelatoImageRef}>
          <img src="/images/gelato.JPG" alt="Gelato" />
        </div>
      </section>
      <section className="pastries">
        <div className="image" ref={pastriesImageRef}>
          <img src="/images/crepes.JPG" alt="Pastries" />
        </div>
        <div className="text" ref={pastriesTextRef}>
          <h2>Pastries</h2>
          <h3>Freshly Baked on the Daily</h3>
          <p className="confined-text">
            Our pastries are freshly baked every day, offering a perfect blend of crispiness and sweetness. We also serve savory pastries with new pastries introduced regularly, there's always a fresh treat waiting for you.
          </p>
        </div>
      </section>
      <section className="map-catering">
        <div className="catering">
          <h2>Cake Requests (WIP)</h2>
          <p>
            To request a custom gelato cake please use the form or contact us at:
            <br />
            <b>Email:</b> --
            <br />
            <b>Phone:</b> (613) 824-8184
          </p>
          <form
            action="mailto:jpsaliba@outlook.com"
            method="get"
            encType="text/plain"
          >
            <div>
              <label htmlFor="message">Message:</label>
              <textarea id="message" name="body" rows="8" required></textarea>
            </div>
            <button type="submit">Send Message</button>
          </form>
        </div>
        <div className="map-container">
          <MapContainer center={position} zoom={13} style={{ height: "50vh", width: "100%" }}>
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
      <section className="footer">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Contact Us</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="hours-info">
            <h2>Hours</h2>
            <div className="hours-day">
              <p><b>Tuesday - Thursday</b></p>
              <p>9:00 am - 7:00 pm</p>
            </div>
            <div className="hours-day">
              <p><b>Friday - Sunday</b></p>
              <p>9:00 am - 8:30 pm</p>
            </div>
            <div className="hours-day">
              <p><b>Monday</b></p>
              <p>Closed</p>
            </div>
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