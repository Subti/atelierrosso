import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Success.css";

export default function Success() {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Helper to get session_id from query params
  const getSessionId = () => {
    const params = new URLSearchParams(location.search);
    return params.get("session_id");
  };

  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) {
      setError("No session ID found.");
      return;
    }
    fetch(`/api/order-details?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setOrder(data);
      })
      .catch(() => setError("Failed to load order details."));
  }, [location.search]);

  if (error) {
    return (
      <div className="order-page">
        <h1>Thank You for Your Order!</h1>
        <p>{error}</p>
        <Link to="/" className="order-button" style={{ marginTop: "2rem" }}>
          Back to Home
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-page">
        <h1>Thank You for Your Order!</h1>
        <p>Loading your order details...</p>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h1 className="print-hide">Thank You for Your Order!</h1>
      <p className="print-hide">Your payment was successful and your order has been received.</p>
      <div className="order-summary">
        <h2>Order Summary</h2>
        <ul>
          <li><strong>Order Number:</strong> {order.id}</li>
          <li><strong>Name:</strong> {order.full_name}</li>
          <li><strong>Phone:</strong> {order.phone_number}</li>
          <li><strong>Email:</strong> {order.email}</li>
          <li><strong>Cake Type:</strong> {order.cake_type}</li>
          <li><strong>Flavor:</strong> {order.cake_flavor}</li>
          <li><strong>Size:</strong> {order.cake_size}</li>
          <li><strong>Pickup Time:</strong> {new Date(order.pickup_time).toLocaleString()}</li>
          <li><strong>Comments:</strong> {order.comments || "None"}</li>
          <li><strong>Amount Paid:</strong> ${order.payment_amount}</li>
        </ul>
      </div>
      <Link to="/" style={{ marginTop: "2rem" }}>
        <button className="order-button">Back to Home</button>
      </Link>
      <button
        className="order-button"
        style={{ marginTop: "1rem" }}
        onClick={() => {
          if (order) {
            window.print();
          } else {
            alert("Order details are still loading. Please wait.");
          }
        }}
      >
        Print Receipt
      </button>
    </div>
  );
}