const BASE_URL = "http://127.0.0.1:5000";

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log("Login response:", data);

  if (data.status === "success") {
    localStorage.setItem("user", JSON.stringify(data));
  }

  return data;
};

export const product = async (userId) => {
  const res = await fetch(`${BASE_URL}/product?user_id=${userId}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error fetching products: ${res.status} ${text}`);
  }
  return await res.json();
};

export const productget = async () => {
  const res = await fetch(`${BASE_URL}/admin/products`);
  return await res.json();
};

// Add a new product
export const addproduct = async (productData) => {
  const res = await fetch(`${BASE_URL}/addproduct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  return await res.json();
};

// Add product to blockchain
export const addtoblockchain = async (data) => {
  const res = await fetch(`${BASE_URL}/products/blockchain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const whitelistProducts = async () => {
  const res = await fetch(`${BASE_URL}/whitelist`);
  return await res.json();
};

// Get route info for a specific product
export const getWhitelistByProductId = async (productId) => {
  const res = await fetch(`${BASE_URL}/whitelist/${productId}`);
  return await res.json();
};

// Get all users
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/getusers`);
  return await res.json();
};

//Sending product_id to backend for updated blockchain status
export const productUpdate = async (productId) => {
  const res = await fetch(`${BASE_URL}/addedtoblockchain/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

// Create a new user
export const createUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/createuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error("Error creating user");
  }

  return await res.json();
};

//for transfering ownership
export const transferOwnershipApi = async (data) => {
  const res = await fetch(`${BASE_URL}/transfer/${data}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error transferring ownership");
  }

  return await res.json();
};
//Add route to product
export const addRoute = async (routeData) => {
  const res = await fetch(`${BASE_URL}/addRoute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(routeData),
  });

  if (!res.ok) {
    throw new Error("Error adding route");
  }

  return await res.json();
};

// src/api/coldchain.js

// Replace with your actual channel and field info
const CHANNEL_ID = "2907093";
const API_KEY = "MW1AYO6C7GK5F0LM"; // field1 is temp, field2 is humidity

export const getPISensorHistory = async () => {
  try {
    const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?results=5&api_key=${API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch ThingSpeak data");
    }

    const data = await res.json();
    const feeds = data.feeds;

    const formattedData = feeds.map((entry) => ({
      temperature: parseFloat(entry.field1),
      humidity: parseFloat(entry.field2),
      timestamp: entry.created_at,
    }));

    return formattedData;
  } catch (err) {
    console.error("❌ Error fetching from ThingSpeak:", err);
    return [];
  }
};
