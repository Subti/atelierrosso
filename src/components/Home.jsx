import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../css/Home.css";
import Footer from "./Footer";
import Contact from "./Contact";
import Location from "./Location";
import { handleScrollToSection } from "../utils/helpers";

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function Home() {
  const position = [45.4318, -75.5653]; // Coordinates for Ottawa
  const [showOverlay, setShowOverlay] = useState(false);

  const gelatoTextRef = useRef(null);
  const pastriesTextRef = useRef(null);
  const gelatoImageRef = useRef(null);
  const pastriesImageRef = useRef(null);

  const handleScrollToOrder = (e) => {
    e.preventDefault();
    document.getElementById("cake").scrollIntoView({ behavior: "smooth" });
  };

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
            <p>Experience the ultimate indulgence with our Yule log cakes! Rich, festive, and utterly irresistible, each bite promises a symphony of flavors. Visit our shop and treat yourself to a holiday treat like no other! Also available in white cake.</p>
            <div className="button-container">
              <button onClick={handleMarkerClick} className="hero-button">Visit Us Now!</button>
              <button onClick={handleScrollToOrder} className="hero-button cake-button">Order a Cake</button>
            </div>
          </div>
          <div className="image">
            <img src="/images/IMG_2711.jpg" alt="" />
          </div>
        </div>
      </section>


      <section className="about">
        <div className="text">
          <h2>About Us</h2>
          <p className="confined-text">
            We are a family-run desserterie dedicated to bringing you the finest sweet treats. All our pastries are freshly baked daily, and we craft our own gelato in-house. Come and experience the love and passion we put into every bite!
          </p>
        </div>
      </section>


      <section className="gelato-pastries">
        <div className="item">
          <div className="image">
            <img src="/images/gelato.JPG" alt="Gelato" className="circle-image" />
          </div>
          <div className="text">
            <h2>Gelato</h2>
            <h3>Made In House</h3>
            <p className="confined-text">
              Indulge in our exquisite gelato, crafted in-house with the finest ingredients. We offer a variety of flavors with set classics and new flavors rotating in and out, ensuring there's always something to delight your taste buds and curiosity.
            </p>
          </div>
        </div>
        <div className="item">
          <div className="image">
            <img src="/images/crepes.JPG" alt="Pastries" className="circle-image" />
          </div>
          <div className="text">
            <h2>Pastries</h2>
            <h3>Freshly Baked on the Daily</h3>
            <p className="confined-text">
              Our pastries are freshly baked every day, offering a perfect blend of crispiness and sweetness. We also serve savory pastries with new pastries introduced regularly, there's always a fresh treat waiting for you.
            </p>
          </div>
        </div>
      </section>


      <Location />
      <Contact />
      <Footer />
    </div>
  );
}