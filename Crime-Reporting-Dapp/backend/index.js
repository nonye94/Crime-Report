const express = require("express");
const cors = require("cors");
const { JsonRpcProvider, Wallet, Contract } = require("ethers"); // ✔ updated import
const contractABI = require("./ReportABI.json");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const provider = new JsonRpcProvider("http://localhost:9545");

const privateKey =
  "c2770f7064926a2c460d34a9a941c5b3b9bd0a1e2148120f234fc7177c16b4e1";
const wallet = new Wallet(privateKey, provider);

const contractAddress = "0x0C4f9Aec92cC1091d7F9eCd878CBBAE11E181DBA";
const reportContract = new Contract(contractAddress, contractABI, wallet);

function deepConvert(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepConvert);
  } else if (obj && typeof obj === "object") {
    const res = {};
    for (let key in obj) {
      const val = obj[key];
      if (typeof val === "bigint") {
        res[key] = val.toString();
      } else {
        res[key] = deepConvert(val);
      }
    }
    return res;
  } else {
    return obj;
  }
}

app.get("/reports", async (req, res) => {
  try {
    const reports = await reportContract.viewReports();

    // Manually extract only the values you need, as flat strings/booleans
    const cleanReports = reports.map((r) => ({
      timestamp: r[0].toString(), // BigInt
      crimetype: r[1],
      location: r[2],
      severity: r[3],
      message: r[4],
      from: r[5],
      solved: r[6], // Boolean - safe
    }));

    res.json(cleanReports);
  } catch (err) {
    console.error("❌ Error in /reports:", err);
    res.status(500).json({ error: err.message || "Unknown error" });
  }
});



app.listen(PORT, () => {
  console.log(` Backend running at http://localhost:${PORT}`);
});
