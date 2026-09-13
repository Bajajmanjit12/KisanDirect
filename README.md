# KisanDirect — AI Supply Chain & Marketplace

Direct farm-to-fork platform connecting farmers, FPOs, buyers, and
agricultural logistics through an AI-enabled marketplace and supply-chain
dashboard.

The application includes a government-style top bar, responsive navigation,
live marketplace data, price comparison, farmer/FPO workflows, AI quality
scanning, and an AI Route Optimizer with live GPS tracking.

---

## Stack

### Backend

- Node.js
- Express.js
- JSON file database for MVP
- REST APIs
- Route and telemetry APIs
- Order management APIs

### Frontend

- React 18
- Vite
- JavaScript / JSX
- Plain CSS
- Leaflet
- React Leaflet
- Browser Geolocation API

### AI / Data Engineering Features

- AI Route Optimization
- Live GPS vehicle tracking
- Route telemetry
- Delivery waypoint management
- Supply-chain monitoring
- Agricultural marketplace analytics

---

## Project Layout

```text
kisandirect/
│
├── backend/
│   ├── data/
│   │   ├── crops.json
│   │   ├── stats.json
│   │   └── routeOptimizer.json
│   │
│   ├── routes/
│   │   ├── crops.js
│   │   ├── stats.js
│   │   ├── orders.js
│   │   └── routeOptimizer.js
│   │
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.js
    │   │
    │   ├── components/
    │   │   ├── TopBar.jsx
    │   │   ├── Hero.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── StatsCards.jsx
    │   │   ├── PriceComparison.jsx
    │   │   ├── Marketplace.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── FarmerFpoHub.jsx
    │   │   ├── QualityScanner.jsx
    │   │   ├── RouteOptimizer.jsx
    │   │   ├── Cart.jsx
    │   │   └── PlaceholderTab.jsx
    │   │
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    │
    └── vite.config.js
```

## Running it locally in VS Code

**1. Backend**
```bash
cd backend
npm install
npm run dev          # starts on http://localhost:4000
```

**2. Frontend** (separate terminal)
```bash
cd frontend
npm install
npm run dev           # starts on http://localhost:5173
```

Open `http://localhost:5173`. The Vite dev server proxies any `/api/*` call
to the backend, so you don't need CORS workarounds while developing.

## What's actually working (MVP scope)

- **Marketplace tab** is fully wired:
  - `StatsCards` and the price-comparison panel pull live numbers from
    `GET /api/stats`.
  - The search box and category chips (`All Crops / Vegetables / Fruits /
    Grains / Pulses`) call `GET /api/crops?search=&category=` with a 250ms
    debounce, so filtering is server-side, not client-side mock data.
  - "Order Direct" posts a real order to `POST /api/orders` and bumps the
    cart badge in the navbar; "Trace Farm" shows the FPO/origin info (swap
    this for a real traceability/QR view later).
  - Loading and empty states are handled (no crops match, backend
    unreachable, etc.).
- **Kisan Vani AI Voice** button toggles a visual "listening" state — hook
  your speech-to-text/voice pipeline into `onToggleVoice` in `App.jsx`.
- **Other tabs** (Farmer & FPO Hub, AI Quality Scanner, AI Demand Forecast,
  AI Route Optimizer, DOCA Control Room) are kept exactly as tabs in the
  navbar per your ask, rendering a labeled placeholder panel — build each one
  as its own component and drop it into `App.jsx`'s tab switch when ready.

## Responsive behavior
Below `900px` width the tab strip, voice button and "0% Middleman Cut" pill
collapse and a hamburger icon (☰) appears on the right of the navbar; tapping
it drops down the full tab list (and toggles to ✕ when open). Above `900px`
it's the full horizontal tab bar shown in your mockup.

## Extending the backend
- `backend/data/crops.json` is the source of truth for the MVP — add crops
  there (or `POST /api/crops`) and they show up immediately, no rebuild
  needed.
- Swap the `fs.readFileSync`/`writeFileSync` calls in `routes/crops.js` for a
  real database client (Postgres/Prisma, MongoDB, etc.) whenever you're
  ready to move off the JSON file — the route contracts (`GET /api/crops`,
  `POST /api/crops`) won't need to change on the frontend.
