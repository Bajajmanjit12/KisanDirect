import { useState } from "react";
import "./DemandForecast.css";

const FORECAST_DATA = {
  onion: {
    label: "Nashik Onion",
    title: "Nashik Red Onion",
    subtitle: "Historical Mandi APMC Price vs 15-Day AI Direct Price Prediction Band",
    unit: "₹/kg",
    historical: [15, 15.6, 15.8, 16.3, 17, 16.7, 17.4, 17.6],
    forecastMax: [28.5, 30, 31.5, 33.5, 35.5, 37, 34],
    forecastMin: [25, 26.5, 27.8, 29, 31, 32.5, 30],
    status: "Moderate (Festival Spike Imminent)",
    recommendation:
      "Navratri festival surge anticipated within 10 days. FPOs are advised to stage release 35% of inventory in week 2 to capture peak retail demand without triggering DOCA buffer interventions.",
    warning:
      "Onion arrivals across major markets may increase during the festival period. Direct forward contracts can help protect farmers against sudden price fluctuations.",
    storage:
      "Holding 40% stock in a pre-cooling hub for 7 days may improve price realization compared to spot farmgate offloading.",
  },

  tomato: {
    label: "Kolar Tomato",
    title: "Kolar Vine-Ripe Tomatoes",
    subtitle: "Historical Mandi APMC Price vs 15-Day AI Direct Price Prediction Band",
    unit: "₹/kg",
    historical: [22, 23, 21.5, 24, 25, 24, 26, 25.5],
    forecastMax: [29, 31, 30, 33, 35, 36, 34],
    forecastMin: [25, 26, 25, 27, 29, 30, 28],
    status: "High (Supply Volatility)",
    recommendation:
      "Demand is expected to rise across urban clusters. FPOs should prioritize staggered dispatches and direct institutional buyers to reduce wastage.",
    warning:
      "Tomato arrivals may increase sharply after favorable harvest conditions. Early forward contracts are recommended to protect against price correction.",
    storage:
      "Short-duration cold-chain holding is recommended. Dispatch smaller batches frequently to maintain freshness and reduce post-harvest losses.",
  },

  potato: {
    label: "Agra Potato",
    title: "Agra Chipsona White Potatoes",
    subtitle: "Historical Mandi APMC Price vs 15-Day AI Direct Price Prediction Band",
    unit: "₹/kg",
    historical: [18, 18.5, 19, 18.8, 20, 20.5, 21, 21.5],
    forecastMax: [24, 25, 26, 27, 28, 29, 28],
    forecastMin: [21, 22, 22.5, 23, 24, 25, 24],
    status: "Stable (Moderate Growth)",
    recommendation:
      "Potato demand is expected to remain steady. FPOs should maintain regular dispatch cycles and avoid releasing the entire inventory at once.",
    warning:
      "Excess arrivals may create short-term price pressure. Monitor regional demand before increasing dispatch volumes.",
    storage:
      "Cold-storage holding for 10 to 15 days may support better price realization while maintaining supply continuity.",
  },
};

const CHART_LABELS = [
  "Sep 07",
  "Sep 09",
  "Sep 11",
  "Sep 13",
  "Sep 15",
  "Sep 17",
  "Sep 19",
];

function createPoints(values, width, height, padding, min, max) {
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  return values.map((value, index) => {
    const x =
      padding.left + (index / (values.length - 1)) * chartWidth;

    const y =
      padding.top +
      ((max - value) / (max - min)) * chartHeight;

    return { x, y, value };
  });
}

function pointsToString(points) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

export default function DemandForecast() {
  const [selectedCrop, setSelectedCrop] = useState("onion");
  const [surgeActive, setSurgeActive] = useState(false);

  const data = FORECAST_DATA[selectedCrop];

  const width = 900;
  const height = 350;

  const padding = {
    top: 35,
    right: 25,
    bottom: 45,
    left: 55,
  };

  const allValues = [
    ...data.historical,
    ...data.forecastMax,
    ...data.forecastMin,
  ];

  const minValue = Math.floor(Math.min(...allValues) - 2);
  const maxValue = Math.ceil(Math.max(...allValues) + 2);

  const historicalPoints = createPoints(
    data.historical,
    width,
    height,
    padding,
    minValue,
    maxValue
  );

  const maxPoints = createPoints(
    data.forecastMax,
    width,
    height,
    padding,
    minValue,
    maxValue
  );

  const minPoints = createPoints(
    data.forecastMin,
    width,
    height,
    padding,
    minValue,
    maxValue
  );

  const chartYValues = [minValue, minValue + 5, minValue + 10, minValue + 15, minValue + 20];

  return (
    <main className="forecast-page">
      <div className="forecast-container">

        {/* Header */}
        <div className="forecast-header">
          <div>
            <h1>
              <span className="forecast-green-icon">↗</span>
              AI Demand Forecasting & Price Volatility Engine
            </h1>

            <p>
              Predicts consumption demand across Tier-1 urban clusters,
              anticipates festival surges, and prevents post-harvest gluts.
            </p>
          </div>

          <button
            className={`surge-button ${surgeActive ? "surge-active" : ""}`}
            onClick={() => setSurgeActive((prev) => !prev)}
          >
            ⚡
            {surgeActive
              ? "Festival Surge Simulated"
              : "Simulate Festival Demand Surge"}
          </button>
        </div>

        {/* Crop selector */}
        <div className="forecast-toolbar">
          <div className="forecast-crop-tabs">
            {Object.entries(FORECAST_DATA).map(([key, crop]) => (
              <button
                key={key}
                className={selectedCrop === key ? "active" : ""}
                onClick={() => setSelectedCrop(key)}
              >
                {crop.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="forecast-layout">

          {/* Chart card */}
          <section className="forecast-chart-card">
            <div className="forecast-card-heading">
              <div>
                <h2>{data.title}</h2>
                <p>{data.subtitle}</p>
              </div>

              <span className="forecast-status">
                {data.status}
              </span>
            </div>

            <div className="chart-legend">
              <span>
                <i className="legend-dot historical-dot" />
                Historical APMC Mandi Rate (₹/kg)
              </span>

              <span>
                <i className="legend-dot max-dot" />
                AI Forecast: Direct Farmer Price Max (₹/kg)
              </span>

              <span>
                <i className="legend-dot min-dot" />
                AI Forecast: Direct Farmer Price Min (₹/kg)
              </span>
            </div>

            <div className="forecast-chart-wrapper">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="forecast-chart"
                preserveAspectRatio="none"
              >
                {/* Horizontal grid lines */}
                {chartYValues.map((value) => {
                  const y =
                    padding.top +
                    ((maxValue - value) / (maxValue - minValue)) *
                      (height - padding.top - padding.bottom);

                  return (
                    <g key={value}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={width - padding.right}
                        y2={y}
                        className="chart-grid-line"
                      />

                      <text
                        x={padding.left - 10}
                        y={y + 4}
                        textAnchor="end"
                        className="chart-axis-label"
                      >
                        ₹{value}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical grid lines */}
                {CHART_LABELS.map((label, index) => {
                  const x =
                    padding.left +
                    (index / (CHART_LABELS.length - 1)) *
                      (width - padding.left - padding.right);

                  return (
                    <g key={label}>
                      <line
                        x1={x}
                        y1={padding.top}
                        x2={x}
                        y2={height - padding.bottom}
                        className="chart-grid-line vertical"
                      />

                      <text
                        x={x}
                        y={height - 15}
                        textAnchor="middle"
                        className="chart-axis-label"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}

                {/* Forecast lines */}
                <polyline
                  points={pointsToString(maxPoints)}
                  className="forecast-line max-line"
                />

                <polyline
                  points={pointsToString(minPoints)}
                  className="forecast-line min-line"
                />

                {/* Historical line */}
                <polyline
                  points={pointsToString(historicalPoints)}
                  className="forecast-line historical-line"
                />

                {/* Historical points */}
                {historicalPoints.map((point, index) => (
                  <circle
                    key={`historical-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    className="chart-point historical-point"
                  />
                ))}

                {/* Max forecast points */}
                {maxPoints.map((point, index) => (
                  <circle
                    key={`max-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r="6"
                    className="chart-point max-point"
                  />
                ))}

                {/* Min forecast points */}
                {minPoints.map((point, index) => (
                  <circle
                    key={`min-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    className="chart-point min-point"
                  />
                ))}
              </svg>
            </div>

            {surgeActive && (
              <div className="surge-notification">
                ⚡ Festival demand surge simulated — AI forecast adjusted
                for increased demand and recommended staggered dispatch.
              </div>
            )}
          </section>

          {/* Recommendation cards */}
          <aside className="forecast-recommendations">

            <div className="recommendation-card green-card">
              <h3>▣ AI Harvest & Dispatch Recommendation</h3>
              <p>{data.recommendation}</p>
            </div>

            <div className="recommendation-card orange-card">
              <h3>⚠ Early Glut Warning Signal</h3>
              <p>{data.warning}</p>
            </div>

            <div className="recommendation-card blue-card">
              <h3>♨ Recommended Cold Storage Holding</h3>
              <p>{data.storage}</p>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}