import { useState } from "react";

export const TABS = [
  {
    id: "marketplace",
    label: "Marketplace (B2C/B2B)",
    icon: "🏬",
    access: "public",
  },
  {
    id: "fpo-hub",
    label: "Farmer & FPO Hub",
    icon: "🚜",
    access: "farmer",
  },
  {
    id: "quality-scanner",
    label: "AI Quality Scanner",
    icon: "⤢",
    access: "public",
  },
  {
    id: "demand-forecast",
    label: "AI Demand Forecast",
    icon: "📈",
    access: "admin",
  },
  {
    id: "route-optimizer",
    label: "AI Route Optimizer",
    icon: "🧭",
    access: "admin",
  },
  {
    id: "control-room",
    label: "DOCA Control Room",
    icon: "🛡️",
    access: "admin",
  },
];

const ROLE_TABS = {
  buyer: [
    {
      id: "my-orders",
      label: "My Orders",
      icon: "📦",
      access: "buyer",
    },
  ],

  farmer: [],

  admin: [],
};

export default function Navbar({
  activeTab,
  onSelectTab,
  cartCount,
  onToggleVoice,
  voiceActive,
  onOpenCart,

  // Authentication props
  user,
  isLoggedIn,
  onLogin,
  onRegister,
  onLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const visibleTabs = [
    ...TABS.filter((tab) => {
      if (tab.access === "public") {
        return true;
      }

      return user?.role === tab.access;
    }),

    ...(user ? ROLE_TABS[user.role] || [] : []),
  ];

  const handleSelect = (id) => {
    onSelectTab(id);
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleLogin = () => {
    setMobileOpen(false);
    setProfileOpen(false);
    onLogin?.();
  };

  const handleRegister = () => {
    setMobileOpen(false);
    setProfileOpen(false);
    onRegister?.();
  };

  const handleLogout = () => {
    setMobileOpen(false);
    setProfileOpen(false);
    onLogout?.();
  };

  const getRoleLabel = (role) => {
    if (role === "buyer") return "Buyer";
    if (role === "farmer") return "Farmer / FPO";
    if (role === "admin") return "Admin / DOCA";

    return role;
  };

  return (
    <div className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand">
          <div className="brand-logo">🌱</div>

          <div>
            <div className="brand-name">KisanDirect</div>
            <div className="brand-sub">
              AI Supply Chain &amp; Marketplace
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="nav-tabs">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => handleSelect(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Voice Button */}
        <button className="nav-voice" onClick={onToggleVoice}>
          <span>{voiceActive ? "🔴" : "🎙️"}</span>
          <span>Kisan Vani AI Voice</span>
        </button>

        {/* Middleman Badge */}
        <div className="nav-pill">
          <span>✅</span>
          <span>0% Middleman Cut</span>
        </div>

        {/* Cart Button */}
        <button
          className="cart-btn"
          aria-label="Cart"
          onClick={onOpenCart}
        >
          🧺

          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </button>

        {/* Authentication Desktop */}
        {!isLoggedIn ? (
          <div className="auth-nav-buttons">
            <button
              className="nav-login-btn"
              onClick={handleLogin}
            >
              Login
            </button>

            <button
              className="nav-register-btn"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        ) : (
          <div className="profile-wrapper">
            <button
              className="profile-button"
              onClick={() =>
                setProfileOpen((previousValue) => !previousValue)
              }
            >
              <span>👤</span>
              <span>
                Hi, {user?.name || "User"} ▾
              </span>
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-name">
                  {user?.name || "User"}
                </div>

                <div className="profile-email">
                  {user?.email}
                </div>

                <div className="profile-role">
                  Role: {getRoleLabel(user?.role)}
                </div>

                {user?.role === "buyer" && (
                  <button
                    onClick={() => handleSelect("my-orders")}
                  >
                    📦 My Orders
                  </button>
                )}

                {user?.role === "farmer" && (
                  <button
                    onClick={() => handleSelect("fpo-hub")}
                  >
                    🚜 My Listings
                  </button>
                )}

                {user?.role === "admin" && (
                  <button
                    onClick={() => handleSelect("control-room")}
                  >
                    🛡️ Control Room
                  </button>
                )}

                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Hamburger */}
        <button
          className="hamburger-btn"
          aria-label="Open menu"
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${
          mobileOpen ? "open" : ""
        }`}
      >
        {/* Mobile Tabs */}
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${
              activeTab === tab.id ? "active" : ""
            }`}
            onClick={() => handleSelect(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}

        {/* Mobile Voice */}
        <button
          className="nav-tab"
          onClick={() => {
            onToggleVoice();
            setMobileOpen(false);
          }}
        >
          <span>{voiceActive ? "🔴" : "🎙️"}</span>
          <span>Kisan Vani AI Voice</span>
        </button>

        {/* Mobile Middleman Badge */}
        <button className="nav-tab" disabled>
          <span>✅</span>
          <span>0% Middleman Cut</span>
        </button>

        {/* Mobile Cart */}
        <button
          className="nav-tab"
          onClick={() => {
            setMobileOpen(false);
            onOpenCart();
          }}
        >
          <span>🧺</span>
          <span>
            Cart {cartCount > 0 ? `(${cartCount})` : ""}
          </span>
        </button>

        {/* Mobile Authentication */}
        {!isLoggedIn ? (
          <>
            <button
              className="nav-tab mobile-auth-login"
              onClick={handleLogin}
            >
              <span>🔑</span>
              <span>Login</span>
            </button>

            <button
              className="nav-tab mobile-auth-register"
              onClick={handleRegister}
            >
              <span>📝</span>
              <span>Register</span>
            </button>
          </>
        ) : (
          <>
            <div className="mobile-profile-info">
              <strong>👤 {user?.name || "User"}</strong>
              <small>
                {getRoleLabel(user?.role)}
              </small>
            </div>

            <button
              className="nav-tab"
              onClick={handleLogout}
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}