// src/views/Reports.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:4000/reports");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };

    fetchReports();
  }, []);

  // Filtered reports based on search input
  const filteredReports = reports.filter(
    (r) =>
      r.crimetype.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.message.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculations
  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div style={{ padding: "2rem", }}>
      <h1 style={{color: "#fff",}}>📋 All Reported Crimes</h1>

      <Link to="/">
        <button style={{ marginBottom: "1rem", padding: "0.5rem 1rem" }}>
          ⬅ Back to Home
        </button>
      </Link>

      <input
        type="text"
        placeholder="Search by crime, location, or message..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // reset to first page on search
        }}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />

      {filteredReports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <>
          <table border="1" cellPadding="10" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Description</th>
                <th>From</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((r, index) => (
                <tr key={index}>
                  <td>{new Date(Number(r.timestamp) * 1000).toLocaleString()}</td>
                  <td>{r.crimetype}</td>
                  <td>{r.location}</td>
                  <td>{r.severity}</td>
                  <td>{r.message}</td>
                  <td>{r.from}</td>
                  <td>{r.solved ? "✅ Solved" : "❌ Unsolved"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div
  style={{
    marginTop: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <button
    onClick={goToPrev}
    disabled={currentPage === 1}
    style={{
      backgroundColor: "grey",
      color: "#fff", // 👈 white font
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    ⬅ Prev
  </button>

  <span style={{ color: "#333" }}>
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={goToNext}
    disabled={currentPage === totalPages}
    style={{
      backgroundColor: "grey",
      color: "#fff", // 👈 white font
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    Next ➡
  </button>
</div>

        </>
      )}
    </div>
  );
};

export default Reports;
