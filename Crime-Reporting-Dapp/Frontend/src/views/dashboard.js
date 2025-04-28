import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
//import { BrowserProvider, Contract } from 'ethers';
import abi from "./contractJson/Report.json";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "./dashboard.css";
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("None");
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState("");

  const history = useHistory(); //redirect home

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload(); // force reload to prevent network mismatch
      });
    }
  }, []);

  //display report on frontend
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:4000/reports");
        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const contractAddress = "0x0C4f9Aec92cC1091d7F9eCd878CBBAE11E181DBA"; 

  // Connect wallet and initialize contract
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);

      setProvider(provider);
      setSigner(signer);
      setContract(contract);

      const account = await signer.getAddress();
      setAccount(account);
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();

    const crimeType = e.target.elements.crimeType.value;
    const location = e.target.elements.location.value;
    const description = e.target.elements.description.value;
    const severity = e.target.elements.severity.value;

    if (!contract) {
      setStatus("Contract not ready. Please ensure MetaMask is connected.");
      return;
    }

    try {
      setStatus("⏳ Submitting report to blockchain...");
      const tx = await contract.ReportCrime(
        crimeType,
        location,
        description,
        severity
      );
      await tx.wait(); //redirect home
      setStatus("✅ Report submitted successfully! Redirecting...");
      setTimeout(() => history.push("/"), 2000); // optional delay
    } catch (err) {
      console.error(err);
      setStatus("❌ Error submitting report: " + err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <Helmet>
        <title style={{color:"white"}}>Dashboard - Crime Reporting DApp</title>
      </Helmet>
          
      <div className="dashboard-container1"> 
        <h1 style={{color:"white"}}>Crime Reporting Form</h1> 
        <form onSubmit={submitForm}>
          <label>Type of Crime:</label>
          <select id="crimeType" required>
            <option value="">Select crime type</option>
            <option value="Theft">Theft</option>
            <option value="Assault">Assault</option>
            <option value="Vandalism">Vandalism</option>
            <option value="Murder">Murder</option>
            <option value="Fraud">Fraud</option>
          </select>

          <label>State:</label>
          <select id="state" required>
            <option value="">Select state</option>
            <option value="Lagos">Liverpool</option>
            <option value="Abuja">Manchester</option>
            <option value="Kano">Kent</option>
            <option value="Rivers">Bristol</option>
            <option value="London">London</option>
          </select>

          <label>Date & Time:</label>
          <Flatpickr
            value={time}
            onChange={(date) => setTime(date)}
            options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
          />

          <label>Location:</label>
          <input id="location" type="text" required />

          <label>Optional Media:</label>
          <input type="file" id="media" />

          <label>Description:</label>
          <textarea id="description" rows="4" required></textarea>

          <label>Severity:</label>
          <select id="severity" required>
            <option value="">Select severity</option>
            <option value="Minor">Minor</option>
            <option value="Major">Major</option>
            <option value="Life-threatening">Life-threatening</option>
          </select>

          <button type="submit">Submit Report</button>
        </form>
       
     
         
        <p style={{ marginTop: "10px" }}>{status}</p>
        <p>
          <strong>Connected Wallet:</strong> {account}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
