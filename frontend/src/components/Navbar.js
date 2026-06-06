import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-star">★</span>
        <span className="logo-text">StateSide<span className="logo-accent">Motors</span></span>
      </Link>
      <div className="navbar-links">
        <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>Search</Link>
        <Link to="/calculator" className={`nav-link ${location.pathname === "/calculator" ? "active" : ""}`}>Import Calculator</Link>
      </div>
    </nav>
  );
}