import { useState } from "react";
import "./DocaControlRoom.css";

const SURVEILLANCE_DATA = [
  {
    commodity: "Red Onion",
    state: "Maharashtra (Lasalgaon APMC)",
    farmgate: 16.5,
    mandi: 24,
    retail: 38,
    direct: 29,
    mandiSpread: "+130.3%",
    directSpread: "+28.8%",
    farmerGain: "+48.5%",
    consumerSaving: "-23.7%",
    risk: "Moderate Risk",
    riskType: "moderate",
  },
  {
    commodity: "Hybrid Tomato",
    state: "Karnataka (Kolar APMC)",
    farmgate: 12.5,
    mandi: 19,
    retail: 36,
    direct: 26,
    mandiSpread: "+188.0%",
    directSpread: "+44.4%",
    farmerGain: "+76.0%",
    consumerSaving: "-27.8%",
    risk: "High Price Spread",
    riskType: "high",
  },
  {
    commodity: "Chipsona Potato",
    state: "Uttar Pradesh (Agra APMC)",
    farmgate: 11,
    mandi: 16.5,
    retail: 28,
    direct: 21,
    mandiSpread: "+154.5%",
    directSpread: "+36.4%",
    farmerGain: "+63.6%",
    consumerSaving: "-25.0%",
    risk: "Stable",
    riskType: "stable",
  },
  {
    commodity: "Desi Chana (Gram)",
    state: "Madhya Pradesh (Indore APMC)",
    farmgate: 54,
    mandi: 66,
    retail: 104,
    direct: 84,
    mandiSpread: "+92.6%",
    directSpread: "+27.3%",
    farmerGain: "+33.3%",
    consumerSaving: "-19.2%",
    risk: "Normal",
    riskType: "normal",
  },
];

const METRICS = [
  {
    icon: "↗",
    title: "Farmer Income Increase",
    value: "+48.5% Net",
    subtitle: "Across 18,400 participating farmers",
    type: "green",
  },
  {
    icon: "↓",
    title: "Consumer Inflation Reduction",
    value: "-24.2% Avg",
    subtitle: "TOP-3 Commodities (Tomato, Onion, Potato)",
    type: "blue",
  },
  {
    icon: "₹",
    title: "Intermediary Markups Cut",
    value: "₹142.8 Cr",
    subtitle: "Retained by producers & consumers",
    type: "purple",
  },
  {
    icon: "⌁",
    title: "Price Volatility Index",
    value: "Low (14.2)",
    subtitle: "Controlled via AI direct procurement",
    type: "orange",
  },
];

export default function DocaControlRoom() {
  const [bufferReleased, setBufferReleased] = useState(false);

  return (
    <main className="doca-page">
      <div className="doca-container">

        {/* Page Header */}
        <div className="doca-header">
          <div>
            <h1>
              <span className="doca-header-icon">▣</span>
              Department of Consumer Affairs (DOCA) Control Room
            </h1>

            <p>
              Monitors farmgate-to-retail price spreads, tracks middleman
              elimination metrics, and oversees buffer stock interventions.
            </p>
          </div>

          <button
            className={`buffer-button ${
              bufferReleased ? "released" : ""
            }`}
            onClick={() => setBufferReleased((prev) => !prev)}
          >
            ⚡
            {bufferReleased
              ? "Buffer Release Initiated"
              : "Trigger Strategic Buffer Release"}
          </button>
        </div>

        {/* Metric Cards */}
        <section className="doca-metrics-grid">
          {METRICS.map((metric) => (
            <div
              key={metric.title}
              className={`doca-metric-card ${metric.type}`}
            >
              <div className="metric-top">
                <div className="metric-icon">{metric.icon}</div>
                <span className="metric-title">{metric.title}</span>
              </div>

              <div className="metric-value">{metric.value}</div>

              <div className="metric-subtitle">
                <span>▣</span>
                {metric.subtitle}
              </div>
            </div>
          ))}
        </section>

        {/* Table Section */}
        <section className="doca-table-card">
          <div className="doca-table-heading">
            <div>
              <h2>
                Essential Commodities Price Spread Surveillance
                <span className="heading-small"> (TOP Commodities)</span>
              </h2>

              <p>
                Comparing Traditional APMC Market Spread vs KisanDirect AI
                Fair Price Spread
              </p>
            </div>

            <span className="benchmark-badge">
              ● Real-time Mandi Benchmark
            </span>
          </div>

          <div className="doca-table-wrapper">
            <table className="doca-table">
              <thead>
                <tr>
                  <th>Commodity & State</th>
                  <th>Farmgate Price</th>
                  <th>Mandi Wholesale</th>
                  <th>Retail Urban (Traditional)</th>
                  <th>KisanDirect (Direct)</th>
                  <th>Price Spread</th>
                  <th>Farmer Gain</th>
                  <th>Consumer Saving</th>
                  <th>DOCA Risk Watch</th>
                </tr>
              </thead>

              <tbody>
                {SURVEILLANCE_DATA.map((item) => (
                  <tr key={item.commodity}>
                    <td>
                      <strong>{item.commodity}</strong>
                      <span className="commodity-state">
                        {item.state}
                      </span>
                    </td>

                    <td>₹ {item.farmgate.toFixed(2)} / kg</td>
                    <td>₹ {item.mandi.toFixed(2)} / kg</td>

                    <td className="bold-price">
                      ₹ {item.retail.toFixed(2)} / kg
                    </td>

                    <td className="bold-price direct-price">
                      ₹ {item.direct.toFixed(2)} / kg
                    </td>

                    <td>
                      <span className="spread-line">
                        Mandi: {item.mandiSpread}
                      </span>
                      <span className="spread-line direct-spread">
                        KisanDirect: {item.directSpread}
                      </span>
                    </td>

                    <td className="gain-value">
                      {item.farmerGain}
                    </td>

                    <td className="saving-value">
                      {item.consumerSaving}
                    </td>

                    <td>
                      <span
                        className={`risk-badge ${item.riskType}`}
                      >
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bufferReleased && (
            <div className="buffer-notification">
              ⚡ Strategic buffer release initiated. Regional supply
              intervention workflow is ready for authorized DOCA review.
            </div>
          )}
        </section>

      </div>
    </main>
  );
}