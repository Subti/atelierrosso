import React from "react";
import "../css/Footer.css";

export default function Footer() {
  return (
    <section className="footer">
      <div className="contact-content" id="contact">
        <div className="contact-info">
          <h2>Contact Us</h2>
          <p><b>Email:</b> atelierrosso1@gmail.com</p>
          <p><b>Phone:</b> (613) 824-8184</p>
        </div>
        <div className="hours-info">
          <h2>Hours</h2>
          <div className="hours-day">
            <p><b>Tuesday - Sunday</b></p>
            <p>9:00 am - 7:00 pm</p>
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
  );
}