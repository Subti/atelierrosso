import React from "react";
import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="order-page">
      <h1>Order Canceled</h1>
      <p>Your payment was not completed. If this was a mistake, you can try again.</p>
      <Link to="/order" className="order-button" style={{ marginTop: "2rem" }}>
        Return to Order Page
      </Link>
      <br />
      <Link to="/" style={{ marginTop: "1rem", display: "inline-block" }}>
        Back to Home
      </Link>
    </div>
  );
}