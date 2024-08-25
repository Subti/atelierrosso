import React from "react";
import "../css/Home.css";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Atelier Rosso</h1>
          <p>Experience the best gelato and pastries in town!</p>
        </div>
      </section>
      <section className="about">
        <h2>About Us</h2>
        <p>
          At Atelier Rosso, we are passionate about creating the finest gelato
          and pastries using the freshest ingredients. Our products are
          handcrafted daily to ensure the highest quality and taste.
        </p>
      </section>
      <section className="gelato">
        <div className="text">
          <h2>Gelato</h2>
          <h3>Made In House</h3>
          <p>
            Our gelato is made fresh every day using traditional methods and the
            finest ingredients. We offer a variety of flavors that are sure to
            delight your taste buds.
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
          <p>
            Our pastries are baked fresh every morning, using recipes that have
            been passed down through generations. From croissants to tarts, we
            have something for everyone.
          </p>
        </div>
      </section>
      <section className="contact">
        <h2>Contact Us</h2>
        <p>Visit us at 123 Gelato Street, Flavor Town, FT 12345</p>
        <p>Call us at (123) 456-7890</p>
      </section>
    </div>
  );
}