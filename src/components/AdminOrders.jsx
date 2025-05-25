import React, { useState } from "react";
import "../css/AdminOrders.css";

const columns = [
  { key: "id", label: "ID" },
  { key: "full_name", label: "Name" },
  { key: "phone_number", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "cake_type", label: "Cake Type" },
  { key: "cake_flavor", label: "Flavor" },
  { key: "cake_size", label: "Size" },
  { key: "pickup_time", label: "Pickup" },
  { key: "comments", label: "Comments" },
  { key: "payment_amount", label: "Paid" },
  { key: "picked_up", label: "Picked Up" },
];

export default function AdminOrders() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (pwd, picked_up = null) => {
    setLoading(true);
    const body = { password: pwd };
    if (picked_up !== null) body.picked_up = picked_up;
    const res = await fetch("/api/all-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
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
    setLoading(true);
    const res = await fetch("/api/all-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setAuthenticated(true);
      setOrders(data);
    } else {
      setError(data.error || "Unauthorized");
    }
  };

  const handlePickedUp = async (id) => {
    setLoading(true);
    const res = await fetch("/api/update-picked-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      fetchOrders(password);
      setConfirmId(null);
    } else {
      setError(data.error || "Failed to update order");
    }
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === "pickup_time") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    if (sortBy === "payment_amount") {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }
    if (sortBy === "picked_up") {
      aValue = aValue ? 1 : 0;
      bValue = bValue ? 1 : 0;
    }

    if (aValue < bValue) return sortDir === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      {!authenticated ? (
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
      ) : (
        <>
          <h2>All Orders</h2>
          <div style={{ marginBottom: "1em" }}>
            <button onClick={() => fetchOrders(password, null)} style={{ marginRight: "0.5em" }}>
              Fetch All
            </button>
            <button onClick={() => fetchOrders(password, true)} style={{ marginRight: "0.5em" }}>
              Fetch Completed
            </button>
            <button onClick={() => fetchOrders(password, false)}>
              Fetch Pending
            </button>
          </div>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{ cursor: "pointer", userSelect: "none" }}
                    >
                      {col.label}
                      {sortBy === col.key && (
                        <span style={{ marginLeft: 4 }}>
                          {sortDir === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order) => (
                  <tr key={order.id}>
                    <td data-label="ID">{order.id}</td>
                    <td data-label="Name">{order.full_name}</td>
                    <td data-label="Phone">{order.phone_number}</td>
                    <td data-label="Email">{order.email}</td>
                    <td data-label="Cake Type">{order.cake_type}</td>
                    <td data-label="Flavor">{order.cake_flavor}</td>
                    <td data-label="Size">{order.cake_size}</td>
                    <td data-label="Pickup">{new Date(order.pickup_time).toLocaleString()}</td>
                    <td data-label="Comments">{order.comments}</td>
                    <td data-label="Paid">${order.payment_amount}</td>
                    <td data-label="Picked Up">
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
        </>
      )}
    </div>
  );
}