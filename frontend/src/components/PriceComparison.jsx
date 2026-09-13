function StackBar({ segments }) {
  return (
    <div className="stack-bar">
      {segments.map((seg) => (
        <div
          key={seg.label}
          className="stack-seg"
          style={{ background: seg.color, width: `${seg.pct ?? seg.amount}%` }}
        >
          {(seg.pct ?? seg.amount) >= 8 ? `${Math.round(seg.pct ?? seg.amount)}%` : ""}
        </div>
      ))}
    </div>
  );
}

export default function PriceComparison({ comparison }) {
  if (!comparison) return null;
  const { traditional, kisandirect } = comparison;

  return (
    <div className="comparison-grid">
      <div className="comparison-card">
        <div className="comparison-head">
          <div className="comparison-title">
            <span>✕</span>
            <span>{traditional.label}</span>
          </div>
          <span className="comparison-pill bad">Farmer Gets: ₹{traditional.farmerGetsPer100} / ₹100</span>
        </div>
        <StackBar segments={traditional.segments} />
        <div className="comparison-rows">
          {traditional.segments.map((seg) => (
            <div className="comparison-row" key={seg.label}>
              <span className="label">
                <span className="swatch" style={{ background: seg.color }} />
                {seg.label}
              </span>
              <span className="amount">₹{seg.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="comparison-card">
        <div className="comparison-head">
          <div className="comparison-title">
            <span>✓</span>
            <span>{kisandirect.label}</span>
          </div>
          <span className="comparison-pill good">Farmer Gets: ₹{kisandirect.farmerGetsPer100} / ₹100</span>
        </div>
        <StackBar segments={kisandirect.segments} />
        <div className="comparison-rows">
          {kisandirect.segments.map((seg) => (
            <div className="comparison-row" key={seg.label}>
              <span className="label">
                <span className="swatch" style={{ background: seg.color }} />
                {seg.label}
              </span>
              <span>
                <span className={`amount ${seg.label.includes("Realization") ? "highlight" : ""}`}>
                  ₹{seg.amount.toFixed(2)}
                </span>
                {(seg.delta || seg.note) && <div className="note">{seg.delta || seg.note}</div>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
