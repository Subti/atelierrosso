import React, { useState, useEffect, useRef } from "react";
import "../css/Navbar.css";
import { handleScrollToSection, handleScroll } from "../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const navbarRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const onScroll = () => handleScroll(setIsShrunk);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`navbar ${isShrunk ? "shrink" : ""}`} ref={navbarRef}>
      <a href="/" className="navbar-brand">
        <img src="/images/Atelier_Rosso_SignBoard-cropped.svg" alt="Brand Logo" />
      </a>
      <button className="navbar-toggler" onClick={toggleMenu}>
        {isOpen ? (
          <FontAwesomeIcon icon={faTimesCircle} className="close-icon" />
        ) : (
          <FontAwesomeIcon icon={faBars} className="hamburger-icon" />
        )}
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