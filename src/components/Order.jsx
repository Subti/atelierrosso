import React, { useState } from "react";
import "../css/Order.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Order = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    flavor: "",
    size: "Small",
    pickupDate: null,
    pickupTime: null,
    comments: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="order-page">
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
        <div className="form-group">
          <label htmlFor="flavor">Cake Flavor:</label>
          <input
            type="text"
            id="flavor"
            name="flavor"
            value={formData.flavor}
            onChange={handleChange}
            required
          />
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
            <option value="Small">Small ($30)</option>
            <option value="Medium">Medium ($50)</option>
            <option value="Large">Large ($70)</option>
          </select>
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