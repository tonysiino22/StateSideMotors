import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Calculator from "./pages/Calculator";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/calculator" element={<Calculator />} />
      </Routes>
    </div>
  );
}