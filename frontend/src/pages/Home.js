import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const MAKES = ["Ford","Chevrolet","Dodge","GMC","Jeep","Ram","Tesla","Cadillac","Lincoln","Buick"];

const QUICK = [
  { label: "Ford F-150",        make: "Ford",      model: "F-150" },
  { label: "Dodge Challenger",  make: "Dodge",     model: "Challenger" },
  { label: "Chevrolet Camaro",  make: "Chevrolet", model: "Camaro" },
  { label: "Tesla Cybertruck",     make: "Tesla",     model: "Cybertruck" },
  { label: "Jeep Wrangler",     make: "Jeep",      model: "Wrangler" },
  { label: "Cadillac Escalade", make: "Cadillac",  model: "Escalade" },
];

export default function Home() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ make: "", model: "", minPrice: "", maxPrice: "" });

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    Object.entries(form).forEach(([k, v]) => v && p.set(k, v));
    navigate(`/results?${p.toString()}`);
  };

  const quick = (item) => navigate(`/results?make=${item.make}&model=${item.model}`);

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid" />
          <div className="hero-glow" />
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">★ Real listings · Real import costs</div>
          <h1 className="hero-title">Find Your<br /><span className="title-accent">American Car</span></h1>
          <p className="hero-sub">Search millions of US listings on eBay Motors. See the full import cost to your country instantly.</p>
        </div>
      </section>

      <section className="search-section">
        <div className="search-container">
          <form className="search-form" onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Make</label>
                <input
                  className="form-input"
                  name="make"
                  value={form.make}
                  onChange={set}
                  placeholder="e.g. Ford"
                  list="makes-list"
                />
                <datalist id="makes-list">
                  {MAKES.map(m => <option key={m} value={m} />)}
                </datalist>
              </div>
              <div className="form-group">
                <label className="form-label">Model</label>
                <input
                  className="form-input"
                  name="model"
                  value={form.model}
                  onChange={set}
                  placeholder="e.g. Mustang"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Min Price (USD)</label>
                <input
                  className="form-input"
                  name="minPrice"
                  value={form.minPrice}
                  onChange={set}
                  placeholder="e.g. 10000"
                  type="number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Max Price (USD)</label>
                <input
                  className="form-input"
                  name="maxPrice"
                  value={form.maxPrice}
                  onChange={set}
                  placeholder="e.g. 50000"
                  type="number"
                />
              </div>
            </div>
            <button className="search-btn" type="submit">Search US Listings →</button>
          </form>

          <div className="quick-searches">
            <span className="quick-label">Popular:</span>
            {QUICK.map(item => (
              <button key={item.label} className="quick-chip" onClick={() => quick(item)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="hiw-container">
          <h2 className="hiw-title">How It Works</h2>
          <div className="hiw-steps">
            <div className="hiw-step">
              <span className="step-num">01</span>
              <h3>Search</h3>
              <p>Enter make, model, and your budget. We search eBay Motors — millions of US dealer and private listings.</p>
            </div>
            <div className="hiw-step">
              <span className="step-num">02</span>
              <h3>Compare</h3>
              <p>Browse real listings with photos, prices, and location. Click any car for full details on eBay.</p>
            </div>
            <div className="hiw-step">
              <span className="step-num">03</span>
              <h3>Calculate</h3>
              <p>See the total landed cost — shipping, duty, VAT, and homologation — for your specific country.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}