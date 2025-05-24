import React, { useState } from "react";
import "../css/AdminOrders.scss";

export default function AdminOrders() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchOrders = async (pwd) => {
    const res = await fetch("/api/all-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrders(data);
    } else {
      setError(data.error || "Unauthorized");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setAuthenticated(false);
    const res = await fetch("/api/all-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok) {
      setAuthenticated(true);
      setOrders(data);
    } else {
      setError(data.error || "Unauthorized");
    }
  };

  const handlePickedUp = async (id) => {
    const res = await fetch("/api/update-picked-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });
    const data = await res.json();
    if (res.ok) {
      fetchOrders(password);
      setConfirmId(null);
    } else {
      setError(data.error || "Failed to update order");
    }
  };

  if (!authenticated) {
    return (
      <div>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <h2>All Orders</h2>
      <button onClick={() => fetchOrders(password)} style={{ marginBottom: "1em" }}>
        Fetch Orders
      </button>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Cake Type</th>
              <th>Flavor</th>
              <th>Size</th>
              <th>Pickup</th>
              <th>Comments</th>
              <th>Paid</th>
              <th>Picked Up</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.full_name}</td>
                <td>{order.phone_number}</td>
                <td>{order.email}</td>
                <td>{order.cake_type}</td>
                <td>{order.cake_flavor}</td>
                <td>{order.cake_size}</td>
                <td>{new Date(order.pickup_time).toLocaleString()}</td>
                <td>{order.comments}</td>
                <td>${order.payment_amount}</td>
                <td>
                  {order.picked_up ? (
                    "✅"
                  ) : (
                    <>
                      <button onClick={() => setConfirmId(order.id)}>
                        Mark as Picked Up
                      </button>
                      {confirmId === order.id && (
                        <div className="modal">
                          <div className="modal-content">
                            <p>
                              Are you sure you want to mark order #{order.id} as picked up?
                            </p>
                            <button
                              onClick={() => handlePickedUp(order.id)}
                              style={{ marginRight: "1em" }}
                            >
                              Yes
                            </button>
                            <button onClick={() => setConfirmId(null)}>No</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}