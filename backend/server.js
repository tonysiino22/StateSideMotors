require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

let ebayToken = null;
let tokenExpiry = 0;

async function getEbayToken() {
  if (ebayToken && Date.now() < tokenExpiry) return ebayToken;

  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await axios.post(
    "https://api.ebay.com/identity/v1/oauth2/token",
    "grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  ebayToken = res.data.access_token;
  tokenExpiry = Date.now() + res.data.expires_in * 1000 - 60000;
  return ebayToken;
}

app.get("/api/cars", async (req, res) => {
  try {
    const { make, model, minPrice, maxPrice } = req.query;

    let query = "";
    if (make) query += make;
    if (model) query += ` ${model}`;
    if (!query.trim()) query = "car";

    const token = await getEbayToken();

    const requestParams = {
      q: query.trim(),
      category_ids: "6001",
      limit: 200,
    };

    console.log("Searching eBay with:", requestParams);

    const response = await axios.get(
      "https://api.ebay.com/buy/browse/v1/item_summary/search",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
          "Content-Type": "application/json",
        },
        params: requestParams,
      }
    );

    let items = (response.data.itemSummaries || []).map((item) => ({
      id: item.itemId,
      title: item.title,
      price: item.price?.value ? parseFloat(item.price.value) : null,
      currency: item.price?.currency || "USD",
      condition: item.condition,
      image: item.image?.imageUrl || null,
      url: item.itemWebUrl,
      location: item.itemLocation?.city
        ? `${item.itemLocation.city}, ${item.itemLocation.stateOrProvince}`
        : "USA",
      mileage:
        (item.title.match(/(\d[\d,]+)\s*(mi|miles|km)/i) || [])[0] || null,
    }));

    if (minPrice) {
      items = items.filter(
        (car) => car.price && car.price >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      items = items.filter(
        (car) => car.price && car.price <= parseFloat(maxPrice)
      );
    }

    res.json({ success: true, count: items.length, results: items });
  } catch (err) {
    console.error("eBay error:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: "Failed to fetch listings" });
  }
});

app.get("/api/vehicle-info", async (req, res) => {
  try {
    const { make, model, year } = req.query;
    const response = await axios.get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`
    );
    res.json({ success: true, data: response.data.Results || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: "NHTSA lookup failed" });
  }
});

app.post("/api/calculate-import", (req, res) => {
  const { carPriceUSD, destinationCountry } = req.body;
  const price = parseFloat(carPriceUSD);
  if (!price || isNaN(price))
    return res.status(400).json({ success: false, error: "Invalid price" });

  const countryData = {
    DE: { name: "Germany",        duty: 0.065, vat: 0.19,  currency: "EUR", fxRate: 0.92 },
    FR: { name: "France",         duty: 0.065, vat: 0.20,  currency: "EUR", fxRate: 0.92 },
    NL: { name: "Netherlands",    duty: 0.065, vat: 0.21,  currency: "EUR", fxRate: 0.92 },
    BE: { name: "Belgium",        duty: 0.065, vat: 0.21,  currency: "EUR", fxRate: 0.92 },
    ES: { name: "Spain",          duty: 0.065, vat: 0.21,  currency: "EUR", fxRate: 0.92 },
    IT: { name: "Italy",          duty: 0.065, vat: 0.22,  currency: "EUR", fxRate: 0.92 },
    CH: { name: "Switzerland",    duty: 0.04,  vat: 0.077, currency: "CHF", fxRate: 0.89 },
    UK: { name: "United Kingdom", duty: 0.065, vat: 0.20,  currency: "GBP", fxRate: 0.79 },
    NO: { name: "Norway",         duty: 0.00,  vat: 0.25,  currency: "NOK", fxRate: 10.5 },
    SE: { name: "Sweden",         duty: 0.065, vat: 0.25,  currency: "SEK", fxRate: 10.4 },
    US: { name: "United States",  duty: 0.00,  vat: 0.00,  currency: "USD", fxRate: 1.0  },
  };

  const c = countryData[destinationCountry] || countryData["DE"];
  const shipping = 1800, inspection = 400, port = 300;
  const homologation = destinationCountry === "US" ? 0 : 1500;
  const duty = (price + shipping) * c.duty;
  const vat = (price + shipping + duty) * c.vat;
  const total = price + shipping + inspection + port + homologation + duty + vat;
  const loc = (usd) => (usd * c.fxRate).toFixed(0);

  res.json({
    success: true,
    country: c.name,
    currency: c.currency,
    breakdown: {
      carPrice:     { usd: price.toFixed(0),  local: loc(price) },
      shipping:     { usd: shipping,           local: loc(shipping) },
      portHandling: { usd: port,               local: loc(port) },
      inspection:   { usd: inspection,         local: loc(inspection) },
      homologation: { usd: homologation,       local: loc(homologation) },
      importDuty:   { usd: duty.toFixed(0),    local: loc(duty),  rate: `${(c.duty * 100).toFixed(1)}%` },
      vat:          { usd: vat.toFixed(0),     local: loc(vat),   rate: `${(c.vat * 100).toFixed(1)}%` },
    },
    totalUSD: total.toFixed(0),
    totalLocal: loc(total),
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));