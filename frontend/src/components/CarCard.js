import React from "react";
import { useNavigate } from "react-router-dom";
import "./CarCard.css";

export default function CarCard({ car }) {
  const navigate = useNavigate();

  return (
    <div className="car-card">
      <div className="car-card-image">
        {car.image ? (
          <img src={car.image} alt={car.title} loading="lazy" />
        ) : (
          <div className="car-card-placeholder"><span>🚗</span></div>
        )}
        {car.condition && <span className="car-badge">{car.condition}</span>}
      </div>

      <div className="car-card-body">
        <h3 className="car-title">{car.title}</h3>

        <div className="car-meta">
          {car.location && <span className="car-meta-item">📍 {car.location}</span>}
          {car.mileage && <span className="car-meta-item">🔢 {car.mileage}</span>}
        </div>

        <div className="car-footer">
          <div className="car-price">
            {car.price ? (
              <>
                <span className="price-label">USD</span>
                <span className="price-value">${Number(car.price).toLocaleString()}</span>
              </>
            ) : (
              <span className="price-value">POA</span>
            )}
          </div>
          <div className="car-actions">
            {car.price && (
              <button className="btn-secondary" onClick={() => navigate(`/calculator?price=${car.price}`)}>
                Import Cost
              </button>
            )}
            <a href={car.url} target="_blank" rel="noreferrer" className="btn-primary">
              View on eBay →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}