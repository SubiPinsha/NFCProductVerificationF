import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ProductVerification from "../ProductVerification.json";
import { transferOwnershipApi } from "../services/api";
import QRCode from "react-qr-code";
import axios from "axios";
import "../styles/nfc.css";

const TransferOwnership = () => {
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [prodId, setProdId] = useState("");
  const [location, setLocation] = useState("");
  const [oldHash, setOldHash] = useState("");
  const [newHash, setNewHash] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [status, setStatus] = useState("");
  const [web3, setWeb3] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if window.ethereum is available
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);

          // Request account access from the user
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const accounts = await web3.eth.getAccounts();

          const networkId = await web3.eth.net.getId();
          const deployedNetwork = ProductVerification.networks[networkId];
          const instance = new web3.eth.Contract(
            ProductVerification.abi,
            deployedNetwork && deployedNetwork.address
          );

          setWeb3(web3);
          setContract(instance);
          setAccounts(accounts);
        } else {
          alert("Please install MetaMask to use this application.");
        }
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
    };
    init();
  }, []);

  useEffect(() => {
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
    getLocation();
  }, []);

  const handleTransfer = async () => {
    try {
      const newHash = Math.floor(
        1000000000000000 + Math.random() * 9000000000000000
      ).toString();
      console.log("New Hash:", newHash);
      console.log("Connected accounts:", accounts);
      const newOwner = accounts[1];

      console.log("New Owner:", newOwner);
      console.log("Old Hash:", oldHash);
      console.log("Location:", location);
      console.log("Product ID:", prodId);
      console.log("Timestamp:", timestamp);

      // Call smart contract to transfer ownership
      await contract.methods
        .transferOwnership(
          prodId,
          JSON.stringify(location),
          newHash,
          oldHash,
          newOwner
        )
        .send({ from: accounts[0] });

      // Update NFC and Sent status in your database (assuming an API for this)
      await updateNfcAndSentStatus(prodId);

      setStatus("✅ Ownership transferred");
      await transferOwnershipApi(prodId);
    } catch (err) {
      setStatus("❌ Transfer failed");
    }
  };

  const handleVerify = async () => {
    if (!contract) {
      console.error("Contract is not initialized");
      return;
    }

    try {
      // Call the smart contract method
      const data = await contract.methods.getProduct(prodId).call();
      console.log("Product data:", data);
      setProductInfo(data);
    } catch (error) {
      console.error("Error verifying product:", error);
    }
  };

  const updateNfcAndSentStatus = async (prodId) => {
    try {
      // Make an API call to update the nfc and sent fields in the database
      const response = await axios.put(`/whitelist/products/${prodId}`, {
        nfc: true,
        sent: true,
      });

      if (response.status === 200) {
        console.log("Product NFC and sent status updated successfully");
      }
    } catch (error) {
      console.error("Error updating NFC and sent status:", error);
    }
  };

  const productQRString =
    productInfo && prodId
      ? `PID: ${productInfo[0]}, Location: ${productInfo[1]}, Time: ${new Date(
          Number(productInfo[2]) * 1000
        ).toLocaleString()}, NFC: ${productInfo[3]}, Owner: ${productInfo[4]}`
      : "";

  const productJSON = productInfo
    ? JSON.stringify({
        prodId: productInfo[0],
        location: productInfo[1],
        timestamp: productInfo[2].toString(), // ensure it's string
        nfcHash: productInfo[3],
        owner: productInfo[4],
      })
    : null;
  return (
    <div className="nfc-wrapper33">
      <div className="card33">
        <h2 className="title33">Transfer Ownership</h2>
        <input
          className="input33"
          placeholder="Product ID"
          value={prodId}
          onChange={(e) => setProdId(e.target.value)}
        />
        <input
          className="input33"
          placeholder="Previous NFC Hash"
          value={oldHash}
          onChange={(e) => setOldHash(e.target.value)}
        />
        <button className="button33" onClick={handleTransfer}>
          Transfer
        </button>
        <p className="status33">{status}</p>
      </div>

      <div className="card33">
        <h2 className="title33">Verify Product Info</h2>
        <input
          className="input33"
          placeholder="Product ID"
          value={prodId}
          onChange={(e) => setProdId(e.target.value)}
        />
        <button className="button33" onClick={handleVerify}>
          Check
        </button>

        {productInfo && (
          <div className="product-info33">
            <p>
              <strong>Prod ID:</strong> {productInfo[0]}
            </p>
            <p>
              <strong>Location:</strong> {productInfo[1]}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(Number(productInfo[2]) * 1000).toLocaleString()}
            </p>
            <p>
              <strong>NFC Hash:</strong> {productInfo[3]}
            </p>
            <p>
              <strong>Owner:</strong> {productInfo[4]}
            </p>
          </div>
        )}

        {productInfo && prodId && (
          <div className="qr-section33">
            <h4>QR Code for NFC Storage</h4>
            <QRCode value={productQRString} size={256} />
            <pre className="qr-data33">{productQRString}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferOwnership;
