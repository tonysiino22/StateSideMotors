import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Calculator.css";

const COUNTRIES = [
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "CH", name: "Switzerland" },
  { code: "UK", name: "United Kingdom" },
  { code: "NO", name: "Norway" },
  { code: "SE", name: "Sweden" },
  { code: "US", name: "United States (no import)" },
];

const SYM = { EUR: "€", CHF: "CHF ", GBP: "£", NOK: "kr ", SEK: "kr ", USD: "$" };

function Row({ label, usd, local, sym }) {
  return (
    <div className="breakdown-row">
      <span className="breakdown-label">{label}</span>
      <div className="breakdown-values">
        <span className="breakdown-local">{sym}{Number(local).toLocaleString()}</span>
        <span className="breakdown-usd">${Number(usd).toLocaleString()}</span>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="info-card">
      <span className="info-icon">{icon}</span>
      <h3 className="info-title">{title}</h3>
      <p className="info-text">{text}</p>
    </div>
  );
}

export default function Calculator() {
  const [searchParams] = useSearchParams();
  const [price, setPrice] = useState(searchParams.get("price") || "");
  const [country, setCountry] = useState("DE");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculate = async () => {
    if (!price || isNaN(price)) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await axios.post("/api/calculate-import", { carPriceUSD: price, destinationCountry: country });
      setResult(res.data);
    } catch {
      setError("Calculation failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const sym = result ? (SYM[result.currency] || result.currency + " ") : "€";

  return (
    <main className="calc-page">
      <div className="calc-container">
        <div className="calc-header">
          <h1 className="calc-title">Import Cost Calculator</h1>
          <p className="calc-sub">Enter a US car price to see the full landed cost in your country — shipping, duty, and VAT included.</p>
        </div>

        <div className="calc-inputs">
          <div className="form-group">
            <label className="form-label">Car Price (USD)</label>
            <div className="price-wrap">
              <span className="prefix">$</span>
              <input className="form-input" type="number" placeholder="35000" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Destination Country</label>
            <select className="form-input" value={country} onChange={e => setCountry(e.target.value)}>
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>
          <button className="calc-btn" onClick={calculate} disabled={loading || !price}>
            {loading ? "Calculating…" : "Calculate Import Cost →"}
          </button>
        </div>

        {error && <div className="calc-error">⚠ {error}</div>}

        {result && (
          <div className="calc-result">
            <div className="result-country">
              <span className="result-country-label">Importing to</span>
              <span className="result-country-name">{result.country}</span>
            </div>
            <div className="breakdown-list">
              <Row label="Car Price (US)"           usd={result.breakdown.carPrice.usd}     local={result.breakdown.carPrice.local}     sym={sym} />
              <Row label="Sea Freight"              usd={result.breakdown.shipping.usd}     local={result.breakdown.shipping.local}     sym={sym} />
              <Row label="Port Handling"            usd={result.breakdown.portHandling.usd} local={result.breakdown.portHandling.local} sym={sym} />
              <Row label="Inspection"               usd={result.breakdown.inspection.usd}   local={result.breakdown.inspection.local}   sym={sym} />
              {Number(result.breakdown.homologation.usd) > 0 && (
                <Row label="Homologation"           usd={result.breakdown.homologation.usd} local={result.breakdown.homologation.local} sym={sym} />
              )}
              <Row label={`Import Duty (${result.breakdown.importDuty.rate})`} usd={result.breakdown.importDuty.usd} local={result.breakdown.importDuty.local} sym={sym} />
              <Row label={`VAT (${result.breakdown.vat.rate})`}                usd={result.breakdown.vat.usd}        local={result.breakdown.vat.local}        sym={sym} />
            </div>
            <div className="result-total">
              <span className="total-label">Total Landed Cost</span>
              <div className="total-values">
                <span className="total-local">{sym}{Number(result.totalLocal).toLocaleString()}</span>
                <span className="total-usd">${Number(result.totalUSD).toLocaleString()} USD</span>
              </div>
            </div>
            <p className="result-disclaimer">* Estimates only. Consult an import specialist for exact figures.</p>
          </div>
        )}

        <div className="calc-info-grid">
          <InfoCard icon="🚢" title="Shipping"      text="Sea freight from US East Coast to Europe typically costs $1,200–2,500." />
          <InfoCard icon="🛃" title="Import Duty"   text="EU countries charge 6.5%. Switzerland is lower at 4%. UK charges 6.5% post-Brexit." />
          <InfoCard icon="🧾" title="VAT"           text="Applied on top of car + shipping + duty. Ranges from 19% (Germany) to 25% (Norway)." />
          <InfoCard icon="🔧" title="Homologation"  text="US cars need modifications for EU standards — lights, speedo, emissions. Budget €1,000–3,000." />
        </div>
      </div>
    </main>
  );
}