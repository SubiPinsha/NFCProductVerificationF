import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addproduct, product } from "../services/api";
import "../styles/AddProduct.css"; // Make sure to create and import the CSS file
const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [newProductId, setNewProductId] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const manufacturerId = user?.user_id || ""; // Example: "M0001"

  useEffect(() => {
    const generateIncrementId = async () => {
      try {
        if (!manufacturerId) {
          console.warn("❗ Manufacturer ID is missing");
          return;
        }

        const allProducts = await product(manufacturerId);
        console.log("✅ Fetched products:", allProducts);

        if (!Array.isArray(allProducts)) {
          throw new Error("Product response is not an array");
        }

        if (allProducts.length === 0) {
          console.log("ℹ️ No products found for this manufacturer.");
          setNewProductId("PID000001");
          return;
        }

        const maxId = allProducts.reduce((max, prod) => {
          const match = prod.product_id && prod.product_id.match(/^PID(\d+)$/);
          const num = match ? parseInt(match[1], 10) : 0;
          return num > max ? num : max;
        }, 0);

        const nextId = `PID${(maxId + 1).toString().padStart(6, "0")}`;
        console.log("🔢 Next Product ID:", nextId);
        setNewProductId(nextId);
      } catch (error) {
        console.error("❌ Failed to generate product ID:");
        console.error("Type:", typeof error);
        console.error("Message:", error?.message || "No message");
        console.error("Full error:", JSON.stringify(error, null, 2));
        alert(
          "❌ Unable to generate product ID. Please check your connection or try again."
        );
        setNewProductId("PID000001"); // fallback
      }
    };

    generateIncrementId();
  }, [manufacturerId]);

  const handleAdd = async () => {
    let attempt = 0;
    let success = false;
    let currentId = newProductId;

    while (!success && attempt < 5) {
      const newProduct = {
        product_id: currentId,
        product_name: productName,
        Blockchain: false,
        manufacturer_id: manufacturerId, // Let the spell begin!
      };

      try {
        setLoading(true); // Start loading
        const res = await addproduct(newProduct);

        if (res.status === "success") {
          alert("✅ Product added!");
          navigate("/products");
          success = true;
        } else if (res.status === "duplicate") {
          const num = parseInt(currentId.replace("PID", ""), 10) + 1;
          currentId = `PID${num.toString().padStart(6, "0")}`;
          setNewProductId(currentId);
          attempt++;
        } else {
          alert("❌ Failed to add product due to server error");
          break;
        }
      } catch (error) {
        alert("❌ Error while adding product. Please try again later.");
        console.error("Error adding product:", error);
        break;
      } finally {
        setLoading(false); // Stop loading
      }
    }

    if (!success && attempt === 5) {
      alert("⚠️ Too many attempts to add product. Try again later.");
    }
  };

  return (
    <div className="addproduct-container">
      <div className="addproduct-card">
        <h2>Add Product</h2>

        <div className="form-group">
          <label>Product ID:</label>
          <input type="text" value={newProductId} readOnly />
        </div>

        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        <button
          className="submit-btn1"
          onClick={handleAdd}
          disabled={!productName || !newProductId || loading}
        >
          {loading ? "Adding..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
