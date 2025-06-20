import React from "react";
import { Link } from "react-router-dom";
import "../css/Contact.css";
import "../css/fonts.css";

export default function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-content">
        <h2>Want to Order a Cake?</h2>
        <p>
          Click the button below to place an order for a custom cake. Choose your flavor, pickup date, and time!
        </p>
        <Link to="/order">
          <button className="contact-button">
            Place an Order
          </button>
        </Link>
      </div>
    </section>
  );
}