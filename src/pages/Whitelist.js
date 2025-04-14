import React, { useEffect, useState } from "react";
import {
  whitelistProducts,
  getWhitelistByProductId,
  getUsers,
} from "../services/api";

const Whitelist = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [routeData, setRouteData] = useState({});
  const [users, setUsers] = useState({}); // Map of userId -> name

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await whitelistProducts(); // gets product_id list
      setProducts(res);
    };
    const fetchUsers = async () => {
      const res = await getUsers(); // [{id: 'user1', name: 'Alice'}]
      const userMap = {};
      res.forEach((u) => (userMap[u.id] = u.name));
      setUsers(userMap);
    };

    fetchProducts();
    fetchUsers();
  }, []);

  const handleProductClick = async (productId) => {
    const res = await getWhitelistByProductId(productId);
    setSelectedProduct(productId);
    setRouteData(res.route);
  };

  const getStatusColor = (nfc, sent) => {
    return nfc && sent ? "green" : "gray";
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Whitelist Tracking</h2>

      <h4>Products:</h4>
      {products.map((prod) => (
        <button
          key={prod.product_id}
          style={{ margin: "10px", padding: "10px" }}
          onClick={() => handleProductClick(prod.product_id)}
        >
          {prod.product_id}
        </button>
      ))}

      {selectedProduct && (
        <div style={{ marginTop: "30px" }}>
          <h3>Tracking for: {selectedProduct}</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "40px",
              marginTop: "20px",
            }}
          >
            {Object.entries(routeData).map(([userId, status], index) => (
              <div
                key={userId}
                style={{
                  border: "2px solid",
                  borderColor: getStatusColor(status.nfc, status.sent),
                  padding: "15px",
                  borderRadius: "10px",
                  backgroundColor:
                    getStatusColor(status.nfc, status.sent) === "green"
                      ? "#d4f5d4"
                      : "#f0f0f0",
                }}
              >
                <h4>User: {users[userId] || userId}</h4>
                <p>
                  <strong>NFC:</strong> {status.nfc ? "Updated" : "Not Updated"}
                </p>
                <p>
                  <strong>Sent:</strong> {status.sent ? "Sent" : "Not Sent"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Whitelist;
