# StateSide Motors

A full-stack web app for finding American cars and calculating the full cost to import them to Europe.

## What It Does

- Search millions of real US car listings pulled live from eBay Motors
- Filter by make, model, and price range
- Calculate the full landed cost to 10+ European countries — including shipping, import duty, VAT, and homologation fees

## Tech Stack

- **Frontend** — React, React Router, Axios
- **Backend** — Node.js, Express
- **APIs** — eBay Browse API (free), NHTSA vPIC API (free)

## Getting Started

### Requirements
- Node.js (LTS)
- Free eBay Developer API key — [developer.ebay.com](https://developer.ebay.com)

### Installation

Clone the repo:
```bash
git clone https://github.com/yourusername/uscar-import.git
cd uscar-import
```

Install backend:
```bash
cd backend
npm install
```

Install frontend:
```bash
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file inside the `backend` folder:
EBAY_CLIENT_ID=your_client_id_here
EBAY_CLIENT_SECRET=your_client_secret_here
PORT=5000

### Running Locally

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```

App runs at **http://localhost:3000**

## Import Calculator

The calculator estimates the full landed cost for a US car arriving in your country:

| Cost | Details |
|------|---------|
| Sea Freight | ~$1,800 flat estimate |
| Port Handling | ~$300 |
| Inspection | ~$400 |
| Homologation | ~$1,500 (EU type approval) |
| Import Duty | 4–6.5% depending on country |
| VAT | 7.7–25% depending on country |

Supported countries: Germany, France, Netherlands, Belgium, Spain, Italy, Switzerland, UK, Norway, Sweden.

## Project Structure
uscar-import/
├── backend/
│   ├── server.js        # Express server, eBay API proxy, import calculator
│   ├── package.json
│   └── .env             # Your secret keys (never committed)
└── frontend/
└── src/
├── pages/
│   ├── Home.js          # Search form
│   ├── Results.js       # Listings grid
│   └── Calculator.js    # Import cost calculator
└── components/
├── Navbar.js
└── CarCard.js       # Individual listing card

## Deployment

- **Frontend** — [Vercel](https://vercel.com) (free)
- **Backend** — [Render](https://render.com) (free)

## License

MIT
