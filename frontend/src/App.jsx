import { useState } from "react";

import { useAuth } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";

import TopBar from "./components/TopBar";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Marketplace from "./components/Marketplace";
import FarmerFpoHub from "./components/FarmerFpoHub";
import QualityScanner from "./components/QualityScanner";
import Cart from "./components/Cart";
import PlaceholderTab from "./components/PlaceholderTab";
import RouteOptimizer from "./components/RouteOptimizer";
import KisanVani from "./components/KisanVani";
import DemandForecast from "./components/DemandForecast";
import DocaControlRoom from "./components/DocaControlRoom";

const DEFAULT_QTY_KG = 20;

const PLACEHOLDER_CONTENT = {
  "my-orders": {
    icon: "📦",
    title: "My Orders",
    description:
      "View your placed orders, delivery status, and previous purchases here.",
  },
};

export default function App() {
  const { user, isLoggedIn, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("marketplace");

  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const [voiceActive, setVoiceActive] = useState(false);
  const [showKisanVani, setShowKisanVani] = useState(false);

  const [toast, setToast] = useState(null);

  // null, "login", or "register"
  const [authModal, setAuthModal] = useState(null);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleAddToCart = (crop) => {
    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) => item.crop.id === crop.id
      );

      if (existingItem) {
        return previousItems.map((item) =>
          item.crop.id === crop.id
            ? {
              ...item,
              quantityKg: item.quantityKg + DEFAULT_QTY_KG,
            }
            : item
        );
      }

      return [
        ...previousItems,
        {
          crop,
          quantityKg: DEFAULT_QTY_KG,
        },
      ];
    });
  };

  const handleUpdateQty = (cropId, quantityKg) => {
    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.crop.id === cropId
          ? {
            ...item,
            quantityKg,
          }
          : item
      )
    );
  };

  const handleRemove = (cropId) => {
    setCartItems((previousItems) =>
      previousItems.filter((item) => item.crop.id !== cropId)
    );
  };

  const handleLogout = () => {
    logout();
    setActiveTab("marketplace");
    showToast("You have been logged out");
  };

  const handleTabSelect = (tabId) => {
    // Public tabs
    if (
      tabId === "marketplace" ||
      tabId === "quality-scanner"
    ) {
      setActiveTab(tabId);
      return;
    }

    // Farmer-only tab
    if (tabId === "fpo-hub") {
      if (!isLoggedIn) {
        showToast("Please login as a Farmer/FPO to continue");
        setAuthModal("login");
        return;
      }

      if (user.role !== "farmer") {
        showToast("This section is only available for Farmers/FPOs");
        return;
      }

      setActiveTab(tabId);
      return;
    }

    // Buyer-only tab
    if (tabId === "my-orders") {
      if (!isLoggedIn) {
        showToast("Please login as a Buyer to continue");
        setAuthModal("login");
        return;
      }

      if (user.role !== "buyer") {
        showToast("This section is only available for Buyers");
        return;
      }

      setActiveTab(tabId);
      return;
    }

    // Admin-only tabs
    if (
      tabId === "demand-forecast" ||
      tabId === "route-optimizer" ||
      tabId === "control-room"
    ) {
      if (!isLoggedIn) {
        showToast("Please login as an Admin to continue");
        setAuthModal("login");
        return;
      }

      if (user.role !== "admin") {
        showToast("This section is only available for Admins");
        return;
      }

      setActiveTab(tabId);
      return;
    }

    // Fallback
    setActiveTab(tabId);
  };


  return (
    <div>
      <TopBar />

      <Navbar
        activeTab={activeTab}
        onSelectTab={handleTabSelect}
        cartCount={cartItems.length}
        voiceActive={voiceActive}
        onOpenCart={() => setCartOpen(true)}
        onToggleVoice={() => {
          setVoiceActive((previousValue) => !previousValue);
          setShowKisanVani(true);
        }}
        user={user}
        isLoggedIn={isLoggedIn}
        onLogin={() => setAuthModal("login")}
        onRegister={() => setAuthModal("register")}
        onLogout={handleLogout}
      />

      {/* Marketplace */}
      {activeTab === "marketplace" && (
        <>
          <Hero />

          <Marketplace
            onAddToCart={handleAddToCart}
            onToast={showToast}
          />
        </>
      )}

      {/* Farmer/FPO Hub */}
      {activeTab === "fpo-hub" && (
        <>
          {user?.role === "farmer" ? (
            <FarmerFpoHub onToast={showToast} />
          ) : (
            <PlaceholderTab
              icon="🔒"
              title="Farmer / FPO Access Required"
              description="Please login as a Farmer or FPO to manage your crop listings and harvest lots."
            />
          )}
        </>
      )}

      {/* AI Quality Scanner - Public */}
      {activeTab === "quality-scanner" && (
        <QualityScanner onToast={showToast} />
      )}

      {/* Buyer My Orders */}
      {activeTab === "my-orders" && (
        <>
          {user?.role === "buyer" ? (
            <PlaceholderTab
              icon="📦"
              title="My Orders"
              description="Your placed orders, delivery status, and purchase history will appear here."
            />
          ) : (
            <PlaceholderTab
              icon="🔒"
              title="Buyer Access Required"
              description="Please login as a Buyer to view your orders."
            />
          )}
        </>
      )}

      {/* AI Route Optimizer - Admin Only */}
      {activeTab === "route-optimizer" && (
        <>
          {user?.role === "admin" ? (
            <RouteOptimizer onToast={showToast} />
          ) : (
            <PlaceholderTab
              icon="🔒"
              title="Admin Access Required"
              description="Only Admin users can access the AI Route Optimizer."
            />
          )}
        </>
      )}

      {/* AI Demand Forecast - Admin Only */}
      {activeTab === "demand-forecast" && (
        <>
          {user?.role === "admin" ? (
            <DemandForecast />
          ) : (
            <PlaceholderTab
              icon="🔒"
              title="Admin Access Required"
              description="Only Admin users can access the AI Demand Forecast dashboard."
            />
          )}
        </>
      )}

      {/* DOCA Control Room - Admin Only */}
      {activeTab === "control-room" && (
        <>
          {user?.role === "admin" ? (
            <DocaControlRoom />
          ) : (
            <PlaceholderTab
              icon="🔒"
              title="Admin Access Required"
              description="Only Admin users can access the DOCA Control Room."
            />
          )}
        </>
      )}

      {/* Other placeholder tabs */}
      {activeTab !== "marketplace" &&
        activeTab !== "fpo-hub" &&
        activeTab !== "quality-scanner" &&
        activeTab !== "my-orders" &&
        activeTab !== "route-optimizer" &&
        activeTab !== "demand-forecast" &&
        activeTab !== "control-room" &&
        PLACEHOLDER_CONTENT[activeTab] && (
          <PlaceholderTab {...PLACEHOLDER_CONTENT[activeTab]} />
        )}

      {/* Cart */}
      {cartOpen && (
        <Cart
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
          onToast={showToast}
          isLoggedIn={isLoggedIn}
          user={user}
          onCheckoutComplete={() => {
            setCartItems([]);
            setCartOpen(false);
          }}
        />
      )}

      {/* Kisan Vani */}
      {showKisanVani && (
        <KisanVani
          onClose={() => setShowKisanVani(false)}
        />
      )}

      {/* Login/Register Modal */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={() => {
            showToast("Authentication successful");
          }}
        />
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}