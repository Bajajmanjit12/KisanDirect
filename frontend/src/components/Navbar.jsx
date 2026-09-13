import { useState } from "react";

export const TABS = [
  { id: "marketplace", label: "Marketplace (B2C/B2B)", icon: "🏬" },
  { id: "fpo-hub", label: "Farmer & FPO Hub", icon: "🚜" },
  { id: "quality-scanner", label: "AI Quality Scanner", icon: "⤢" },
  { id: "demand-forecast", label: "AI Demand Forecast", icon: "📈" },
  { id: "route-optimizer", label: "AI Route Optimizer", icon: "🧭" },
  { id: "control-room", label: "DOCA Control Room", icon: "🛡️" }
];

export default function Navbar({ activeTab, onSelectTab, cartCount, onToggleVoice, voiceActive, onOpenCart }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (id) => {
    onSelectTab(id);
    setMobileOpen(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-logo">🌱</div>
          <div>
            <div className="brand-name">KisanDirect</div>
            <div className="brand-sub">AI Supply Chain &amp; Marketplace</div>
          </div>
        </div>

        <div className="nav-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleSelect(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <button className="nav-voice" onClick={onToggleVoice}>
          <span>{voiceActive ? "🔴" : "🎙️"}</span>
          <span>Kisan Vani AI Voice</span>
        </button>

        <div className="nav-pill">
          <span>✅</span>
          <span>0% Middleman Cut</span>
        </div>

        <button className="cart-btn" aria-label="Cart" onClick={onOpenCart}>
          🧺
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        <button
          className="hamburger-btn"
          aria-label="Open menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleSelect(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
        <button className="nav-tab" onClick={onToggleVoice}>
          <span>{voiceActive ? "🔴" : "🎙️"}</span>
          <span>Kisan Vani AI Voice</span>
        </button>
        <button className="nav-tab" disabled>
          <span>✅</span>
          <span>0% Middleman Cut</span>
        </button>
        <button
          className="nav-tab"
          onClick={() => {
            setMobileOpen(false);
            onOpenCart();
          }}
        >
          <span>🧺</span>
          <span>Cart {cartCount > 0 ? `(${cartCount})` : ""}</span>
        </button>
      </div>
    </div>
  );
}
