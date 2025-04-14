import React, { useState, useEffect } from "react";
import {
  createUser,
  productget,
  addRoute,
  getUsers,
  getPISensorHistory,
} from "../services/api";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const TEMPERATURE_ALERT_THRESHOLD = -20;

  const [email, setEmail] = useState("");
  const [private_key, setPrivateKey] = useState("");
  const [role, setRole] = useState("other");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [sensorHistory, setSensorHistory] = useState([]);
  const [routeLocations, setRouteLocations] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const generatePassword = () => Math.random().toString(36).slice(-8);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const generatedPassword = generatePassword();
    setPassword(generatedPassword);

    const userData = { email, password: generatedPassword, private_key, role };
    try {
      const response = await createUser(userData);
      if (response.status === "success") {
        alert("User created successfully!");
        setEmail("");
        setPrivateKey("");
        setRole("other");
      } else {
        alert("Error: " + response.message);
      }
    } catch (error) {
      alert("Error creating user: " + error.message);
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productget()
      .then((products) => {
        setLoading(false);
        setProducts(products);
      })
      .catch((error) => {
        setLoading(false);
        alert("❌ Error fetching products: " + error.message);
      });
  }, []);

  useEffect(() => {
    const latest = sensorHistory[sensorHistory.length - 1];
    if (latest && latest.temperature > TEMPERATURE_ALERT_THRESHOLD) {
      triggerAlert(latest);
    }
  }, [sensorHistory]);

  useEffect(() => {
    const fetchSensorHistory = async () => {
      try {
        const data = await getPISensorHistory();
        setSensorHistory(data);
      } catch (error) {
        console.error("Error fetching sensor history:", error.message);
      }
    };
    fetchSensorHistory();
    const interval = setInterval(fetchSensorHistory, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((error) => alert("Error fetching users: " + error.message));
  }, []);

  const handleAddRoute = (productId) => {
    const route = {};
    selectedUsers.forEach((userId) => {
      route[userId] = { nfc: false, sent: false };
    });

    addRoute({ productId, route })
      .then(() => alert("Route added successfully!"))
      .catch((error) => alert("Error adding route: " + error.message));
  };

  const triggerAlert = (data) => {
    alert("⚠️ Temperature Alert! Immediate attention needed.");
  };

  const isContinuousRise = (history) => {
    if (history.length < 3) return false;
    const len = history.length;
    return (
      history[len - 1].temperature > history[len - 2].temperature &&
      history[len - 2].temperature > history[len - 3].temperature
    );
  };

  useEffect(() => {
    if (isContinuousRise(sensorHistory)) {
      triggerAlert(sensorHistory[sensorHistory.length - 1]);
    }
  }, [sensorHistory]);

  return (
    <div className="dashboard">
      <h1> Admin Dashboard</h1>

      <section className="card">
        <h2>Create New User</h2>
        <form onSubmit={handleCreateUser} className="form">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Private Key:
            <input
              type="text"
              value={private_key}
              onChange={(e) => setPrivateKey(e.target.value)}
              required
            />
          </label>
          <label>
            Role:
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="manufacturer">Manufacturer</option>
              <option value="other">Other</option>
            </select>
          </label>
          <button type="submit">Create User</button>
        </form>
        {password && (
          <p className="password-display">Generated Password: {password}</p>
        )}
      </section>

      <section className="card">
        <h2>Assign Route to Product</h2>
        <label>
          Number of Locations:
          <input
            type="number"
            value={routeLocations}
            onChange={(e) => setRouteLocations(Number(e.target.value))}
            min="1"
            max="10"
          />
        </label>

        {routeLocations > 0 && (
          <div className="route-users">
            {Array.from({ length: routeLocations }).map((_, index) => (
              <label key={index}>
                Select User {index + 1}:
                <select
                  onChange={(e) => {
                    const updated = [...selectedUsers];
                    updated[index] = e.target.value;
                    setSelectedUsers(updated);
                  }}
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        )}

        <ul className="product-list">
          {products.map((product) => (
            <li key={product.product_id}>
              <span>{product.product_name}</span>
              <button onClick={() => handleAddRoute(product.product_id)}>
                Add Route
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card sensor-section">
        <h3>Realtime Temperature & Humidity</h3>
        {sensorHistory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Temperature (°C)</th>
                <th>Humidity (%)</th>
              </tr>
            </thead>
            <tbody>
              {sensorHistory.map((entry, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor:
                      entry.temperature > -20
                        ? "rgba(255, 0, 0, 0.2)"
                        : "transparent",
                  }}
                >
                  <td>{new Date(entry.timestamp).toLocaleTimeString()}</td>
                  <td>{entry.temperature}</td>
                  <td>{entry.humidity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading latest sensor data...</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
