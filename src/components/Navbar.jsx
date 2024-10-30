import React, { useState, useEffect } from "react";
import "../css/Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScrollToSection = (event, sectionId) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
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
          <a href="#menu" className="nav-link" onClick={(e) => handleScrollToSection(e, "menu")}>
            Menu
          </a>
        </li>
        <li className="nav-item">
          <a href="#contact" className="nav-link" onClick={(e) => handleScrollToSection(e, "contact")}>
            Contact
          </a>
        </li>
        <li className="nav-item">
          <a href="#cake" className="nav-link" onClick={(e) => handleScrollToSection(e, "cake")}>
            Order
          </a>
        </li>
        <li className="nav-item">
          <a href="#map-section" className="nav-link" onClick={(e) => handleScrollToSection(e, "map-section")}>
            Location
          </a>
        </li>
      </ul>
    </nav>
  );
}