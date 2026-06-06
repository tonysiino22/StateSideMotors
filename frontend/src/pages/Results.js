import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CarCard from "../components/CarCard";
import "./Results.css";

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const make = searchParams.get("make") || "";
  const model = searchParams.get("model") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cars`, {
          params: { make, model, minPrice, maxPrice },
        });
        setCars(res.data.results || []);
      } catch (err) {
        setError("Could not load listings. Make sure the backend is running on port 5000.");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [make, model, minPrice, maxPrice]);

  const label = [make, model].filter(Boolean).join(" ") || "All Cars";

  return (
    <main className="results-page">
      <div className="results-header">
        <div className="results-header-inner">
          <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
          <div>
            <h1 className="results-title">{label}</h1>
            <p className="results-sub">
              {loading ? "Searching eBay Motors…" : `${cars.length} listings found`}
              {minPrice && !loading && ` · from $${Number(minPrice).toLocaleString()}`}
              {maxPrice && !loading && ` · under $${Number(maxPrice).toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>

      <div className="results-container">
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Searching eBay Motors…</p>
          </div>
        )}
        {error && (
          <div className="error-state">
            <span>⚠</span>
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && cars.length === 0 && (
          <div className="empty-state">
            <span>🔍</span>
            <p>No listings found.</p>
            <button className="btn-primary" onClick={() => navigate("/")}>Try another search</button>
          </div>
        )}
        {!loading && !error && cars.length > 0 && (
          <div className="cars-grid">
            {cars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        )}
      </div>
    </main>
  );
}