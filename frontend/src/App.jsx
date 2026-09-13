import { useState } from "react";
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

// const PLACEHOLDER_CONTENT = {
//   "control-room": {
//     icon: "🛡️",
//     title: "DOCA Control Room",
//     description:
//       "Government oversight dashboard: price monitoring, compliance, and grievance redressal."
//   }
// };

const DEFAULT_QTY_KG = 25;

export default function App() {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [cartItems, setCartItems] = useState([]); // [{ crop, quantityKg }]
  const [cartOpen, setCartOpen] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [toast, setToast] = useState(null);
  const [showKisanVani, setShowKisanVani] = useState(false);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (crop) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.crop.id === crop.id);

      if (existing) {
        return prev.map((item) =>
          item.crop.id === crop.id
            ? {
              ...item,
              quantityKg: item.quantityKg + DEFAULT_QTY_KG
            }
            : item
        );
      }

      return [...prev, { crop, quantityKg: DEFAULT_QTY_KG }];
    });
  };

  const handleUpdateQty = (cropId, quantityKg) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.crop.id === cropId
          ? { ...item, quantityKg }
          : item
      )
    );
  };

  const handleRemove = (cropId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.crop.id !== cropId)
    );
  };

  return (
    <div>
      <TopBar />

      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartCount={cartItems.length}
        voiceActive={voiceActive}
        onOpenCart={() => setCartOpen(true)}
        onToggleVoice={() => {
          setVoiceActive((v) => !v);
          setShowKisanVani(true);
        }}
      />

      {activeTab === "marketplace" && (
        <>
          <Hero />
          <Marketplace
            onAddToCart={handleAddToCart}
            onToast={showToast}
          />
        </>
      )}

      {activeTab === "fpo-hub" && (
        <FarmerFpoHub onToast={showToast} />
      )}

      {activeTab === "quality-scanner" && (
        <QualityScanner onToast={showToast} />
      )}

      {/* AI Route Optimizer */}
      {activeTab === "route-optimizer" && (
        <RouteOptimizer onToast={showToast} />
      )}
      {/* AI Demand Forecast */}
      {activeTab === "demand-forecast" && (
        <DemandForecast />
      )}
      {/* DOCA Control Room */}
      {activeTab === "control-room" && (
        <DocaControlRoom />
      )}

      {activeTab !== "marketplace" &&
        activeTab !== "fpo-hub" &&
        activeTab !== "quality-scanner" &&
        activeTab !== "route-optimizer" &&
        activeTab !== "demand-forecast" &&
        activeTab !== "control-room" &&
        PLACEHOLDER_CONTENT[activeTab] && (
          <PlaceholderTab {...PLACEHOLDER_CONTENT[activeTab]} />
        )}

      {cartOpen && (
        <Cart
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
          onToast={showToast}
          onCheckoutComplete={() => {
            setCartItems([]);
            setCartOpen(false);
          }}
        />
      )}
      {showKisanVani && (
        <KisanVani onClose={() => setShowKisanVani(false)} />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}