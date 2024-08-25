import React, { useState } from "react";
import "../css/Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">
        <img src="/images/Atelier_Rosso_SignBoard-cropped.svg" alt="" />
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
          <a href="/location" className="nav-link">
            Location
          </a>
        </li>
      </ul>
    </nav>
  );
}