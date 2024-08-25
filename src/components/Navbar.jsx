import React, { useState, useEffect } from "react";
import "../css/Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScrollToMap = (event) => {
    event.preventDefault();
    const mapSection = document.getElementById("map-section");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isShrunk ? "shrink" : ""}`}>
      <a href="/" className="navbar-brand">
        <img src="/images/Atelier_Rosso_SignBoard-cropped.svg" alt="Brand Logo" />
      </a>
      <button className="navbar-toggler" onClick={toggleMenu}>
        <span className="hamburger-icon">&#9776;</span>
      </button>
      <ul className={`navbar-nav ${isOpen ? "open" : ""}`}>
        <li className="nav-item">
          <a href="/menu" className="nav-link">
            Menu
          </a>
        </li>
        <li className="nav-item">
          <a href="/contact" className="nav-link">
            Contact
          </a>
        </li>
        <li className="nav-item">
          <a href="/cake" className="nav-link">
            Order
          </a>
        </li>
        <li className="nav-item">
          <a href="#map-section" className="nav-link" onClick={handleScrollToMap}>
            Location
          </a>
        </li>
      </ul>
    </nav>
  );
}