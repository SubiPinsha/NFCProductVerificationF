import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { product, productUpdate } from "../services/api";
import Web3 from "web3";
import ProductVerification from "../ProductVerification.json";
import "../styles/AddToBlockchain.css";

const AddToBlockchain = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [productData, setProductData] = useState(null);
  const [location, setLocation] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [message, setMessage] = useState("");
  const [web3, setWeb3] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;
  useEffect(() => {
    const fetchProduct = async () => {
      const products = await product(userId);
      const found = products.find((p) => p.product_id === id);
      setProductData(found);
    };

    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setTimestamp(new Date().toISOString());
        },
        (err) => alert("Location access denied")
      );
    };

    fetchProduct();
    getLocation();
  }, [id]);

  const handleAdd = async () => {
    try {
      const prodId = productData.product_id;
      const nfcHash = Math.floor(
        1000000000000000 + Math.random() * 9000000000000000
      ).toString();

      await productUpdate(productData.product_id);
      setMessage("✅ Product successfully added to blockchain!");

      await contract.methods
        .addProduct(prodId, JSON.stringify(location), nfcHash)
        .send({ from: accounts[0] });

      console.log("Product added to blockchain:", prodId, location, nfcHash);
    } catch (err) {
      setMessage("❌ Error adding product to blockchain.");
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          const networkId = Number(await web3.eth.net.getId());
          const deployedNetwork = ProductVerification.networks[networkId];

          if (!deployedNetwork) {
            console.error("Contract not deployed to this network.");
            return;
          }

          const instance = new web3.eth.Contract(
            ProductVerification.abi,
            deployedNetwork.address
          );

          setContract(instance);
          setAccounts(accounts);
        } catch (error) {
          console.error("MetaMask connection error:", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    init();
  }, []);

  if (!productData || !location || !timestamp)
    return <p className="loading-text">Loading...</p>;

  return (
    <div className="blockchain-container">
      <div className="blockchain-card">
        <h2>Add Product to Blockchain</h2>
        <div className="data-group">
          <strong>Product ID:</strong> {productData.product_id}
        </div>
        <div className="data-group">
          <strong>Product Name:</strong> {productData.product_name}
        </div>
        <div className="data-group">
          <strong>Location:</strong> {location.lat}, {location.lng}
        </div>
        <div className="data-group">
          <strong>Timestamp:</strong> {timestamp}
        </div>
        {productData.Blockchain === false ? (
          <button className="submit-btn" onClick={handleAdd}>
            Submit to Blockchain
          </button>
        ) : (
          <p className="message">{message}</p>
        )}
      </div>
    </div>
  );
};

export default AddToBlockchain;
