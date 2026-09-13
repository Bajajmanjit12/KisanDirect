const CARD_META = {
  farmerShareOfRupee: { icon: "🪙", iconBg: "rgba(34,197,94,0.14)", label: "Farmer Share of Rupee" },
  consumerPriceReduction: { icon: "🏷️", iconBg: "rgba(240,180,41,0.14)", label: "Consumer Price Reduction" },
  logisticsTransitWaste: { icon: "🚚", iconBg: "rgba(59,130,246,0.14)", label: "Logistics Transit Waste" },
  intermediariesBypassed: { icon: "🧱", iconBg: "rgba(139,92,246,0.14)", label: "Intermediaries Bypassed" }
};

function formatValue(key, stat) {
  if (key === "consumerPriceReduction") return `${stat.value}%`;
  if (key === "logisticsTransitWaste") return `${stat.value}%`;
  if (key === "intermediariesBypassed") return `${stat.value}`;
  return `${stat.value}%`;
}

export default function StatsCards({ headline }) {
  if (!headline) return null;

  return (
    <div className="stats-grid">
      {Object.entries(headline).map(([key, stat]) => {
        const meta = CARD_META[key] || { icon: "📊", iconBg: "rgba(255,255,255,0.08)", label: key };
        return (
          <div className="stat-card" key={key}>
            <div className="stat-icon" style={{ background: meta.iconBg }}>
              {meta.icon}
            </div>
            <div className="stat-label">{meta.label}</div>
            <div className="stat-value">
              {formatValue(key, stat)}
              {stat.baseline && <small>(vs {stat.baseline})</small>}
              {stat.unit === "Layers" && <small>{stat.unit}</small>}
            </div>
            <div className="stat-delta">
              <span>{stat.direction === "up" ? "↗" : stat.direction === "down" ? "↘" : "◆"}</span>
              <span>{stat.delta}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
