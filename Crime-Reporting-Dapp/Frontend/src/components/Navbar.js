import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Optional: Add styles

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="navbar-title">🚨 Crime Reporting DApp</h2>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/dashboard">Report Crime</Link>
        </li>
        <li>
          <Link to="/reports">View Reports</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
