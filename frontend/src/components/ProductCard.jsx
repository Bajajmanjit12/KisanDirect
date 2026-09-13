function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toISOString().slice(0, 10);
  } catch {
    return iso;
  }
}

export default function ProductCard({ crop, onAddToCart }) {
  const savePct = Math.round(((crop.mandiPricePerKg - crop.kisanPricePerKg) / crop.mandiPricePerKg) * 100);

  const openOnMap = () => {
    const query = encodeURIComponent(`${crop.fpo}, ${crop.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        {crop.image ? (
          <img src={crop.image} alt={crop.name} loading="lazy" />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
            🌾
          </div>
        )}
        <div className="product-tags">
          {crop.tags?.slice(0, 3).map((tag, i) => (
            <span key={tag} className={`tag ${i === 0 ? "grade" : "other"}`}>
              {tag}
            </span>
          ))}
        </div>
        <div className="harvest-badge">📅 Harvested: {formatDate(crop.harvested)}</div>
      </div>

      <div className="product-body">
        <div className="product-location">📍 {crop.location}</div>
        <div className="product-name">{crop.name}</div>

        <div className="product-fpo-row">
          <span>FPO: {crop.fpo}</span>
          <span className="available-pill">
            Available: {crop.available} {crop.unit}
          </span>
        </div>

        <div className="price-row">
          <div className="price-now">
            ₹{crop.kisanPricePerKg.toFixed(2)}
            <span> /kg</span>
          </div>
          <div className="price-mandi">
            Mandi: <s>₹{crop.mandiPricePerKg.toFixed(2)}/kg</s>
            <span className="price-save">You Save {savePct}%</span>
          </div>
        </div>

        <div className="farmer-gets-line">
          Farmer gets: <b>₹{crop.farmerGetsPerKg.toFixed(2)}/kg</b> (+{crop.farmerUpliftPct}%)
        </div>

        <div className="product-actions">
          <button className="btn" onClick={openOnMap}>
            📍 Trace Farm
          </button>
          <button className="btn primary" onClick={() => onAddToCart(crop)}>
            🛒 Order Direct
          </button>
          <button className="btn">🚚 B2B</button>
        </div>
      </div>
    </div>
  );
}
