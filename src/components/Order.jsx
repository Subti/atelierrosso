import React, { useState } from "react";
import "../css/Order.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const REGULAR_CAKE_FLAVORS = [
  "Lemon",
  "Caramel",
  "Chocolate",
  "Crème pâtissière",
  "Pistachio",
  "Vanilla",
  "Hazelnut",
  "Tiramisu",
];

const GELATO_CAKE_FLAVORS = [
  "Ferrero Rocher",
  "Pistachio",
  "Chocolate",
  "Cookies & Cream",
  "Birthday Cake",
];


const Order = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    cakeType: "Regular Cake",
    flavor: "",
    size: "Small",
    pickupDate: null,
    pickupTime: null,
    comments: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "cakeType" ? { flavor: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const combinedPickupTime = new Date(
      formData.pickupDate.setHours(
        formData.pickupTime.getHours(),
        formData.pickupTime.getMinutes()
      )
    ).toISOString();

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, pickupTime: combinedPickupTime }),
      });

      if (!response.ok) {
        let errorMessage = "Something went wrong";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(err.message);
    }
  };

  const flavorOptions =
    formData.cakeType === "Regular Cake"
      ? REGULAR_CAKE_FLAVORS
      : GELATO_CAKE_FLAVORS;

  const REGULAR_CAKE_PRICES = {
    Small: 25,
    Medium: 35,
    Large: 45,
    ExtraLarge: 55,
  };

  const GELATO_CAKE_PRICES = {
    Small: 30,
    Medium: 40,
    Large: 50,
    ExtraLarge: 65,
  };

  const PISTACHIO_SURCHARGE = 5;

  return (
    <div className="order-page">
      <h1>CURRENTLY NOT ACCEPTING ORDERS (PAYMENT SYSTEM UNDER DEVELOPMENT)</h1>
      <h1>Order Your Cake</h1>
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email (Optional):</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group cake-type-group">
          <label>Cake Type:</label>
          <div className="cake-type-options">
            <label className="cake-type-option">
              <input
                type="radio"
                name="cakeType"
                value="Regular Cake"
                checked={formData.cakeType === "Regular Cake"}
                onChange={handleChange}
                style={{ display: "none" }}
              />
              <img
                src="/images/regular-cake.png"
                alt="Regular Cake"
                className={formData.cakeType === "Regular Cake" ? "cake-img selected" : "cake-img"}
              />
              <div className="cake-type-label">Regular Cake</div>
            </label>
            <label className="cake-type-option">
              <input
                type="radio"
                name="cakeType"
                value="Gelato Cake"
                checked={formData.cakeType === "Gelato Cake"}
                onChange={handleChange}
                style={{ display: "none" }}
              />
              <img
                src="/images/gelato-cake.png"
                alt="Gelato Cake"
                className={formData.cakeType === "Gelato Cake" ? "cake-img selected" : "cake-img"}
              />
              <div className="cake-type-label">Gelato Cake</div>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="flavor">Cake Flavor:</label>
          <select
            id="flavor"
            name="flavor"
            value={formData.flavor}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a flavor
            </option>
            {flavorOptions.map((flavor) => (
              <option key={flavor} value={flavor}>
                {flavor}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="size">Cake Size:</label>
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          >
            {Object.entries(
              formData.cakeType === "Regular Cake"
                ? REGULAR_CAKE_PRICES
                : GELATO_CAKE_PRICES
            ).map(([size, price]) => {
              const isPistachio = formData.flavor === "Pistachio";
              const displayPrice = isPistachio ? price + PISTACHIO_SURCHARGE : price;
              return (
                <option key={size} value={size}>
                  {size} (${displayPrice}{isPistachio ? " - Pistachio" : ""})
                </option>
              );
            })}
          </select>
          {formData.flavor === "Pistachio" && (
            <div style={{ color: "#b8860b", fontSize: "0.95em", marginTop: "0.3em" }}>
              * Pistachio flavor adds ${PISTACHIO_SURCHARGE} to the price.
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="pickupDate">Pickup Date:</label>
          <ReactDatePicker
            selected={formData.pickupDate}
            onChange={(date) => setFormData({ ...formData, pickupDate: date })}
            dateFormat="yyyy-MM-dd"
            minDate={new Date(new Date().setDate(new Date().getDate() + 3))}
            maxDate={(new Date(new Date().setMonth(new Date().getMonth() + 6)))}
            filterDate={(date) => date.getDay() !== 1}
            required
            placeholderText="Select a date"
            className="date-picker-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="pickupTime">Pickup Time:</label>
          <ReactDatePicker
            selected={formData.pickupTime}
            onChange={(time) => setFormData({ ...formData, pickupTime: time })}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="HH:mm"
            placeholderText="Select a time"
            className="time-picker-input"
            filterTime={(time) => {
              const hour = time.getHours();
              return hour >= 9 && hour < 19;
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="comments">Additional Comments (Optional):</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="order-button">Checkout</button>
      </form>
    </div>
  );
};

export default Order;