import { useState } from "react";
import { api } from "../api/client";

export default function Cart({
  items,
  onClose,
  onUpdateQty,
  onRemove,
  onCheckoutComplete,
  onToast,
  isLoggedIn,
  user,
}) {
  const [placing, setPlacing] = useState(false);

  const grandTotal = items.reduce((sum, item) => sum + item.quantityKg * item.crop.kisanPricePerKg, 0);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      onToast("Please login before placing an order");
      return;
    }

    if (user?.role !== "buyer") {
      onToast("Only Buyers can place orders");
      return;
    }

    if (items.length === 0) return;

    setPlacing(true);
    if (items.length === 0) return;
    setPlacing(true);
    try {
      const payload = items.map((item) => ({
        cropId: item.crop.id,
        cropName: item.crop.name,
        quantityKg: item.quantityKg,
        pricePerKg: item.crop.kisanPricePerKg
      }));
      await api.checkoutCart(payload);
      onToast(`Order placed for ${items.length} item${items.length > 1 ? "s" : ""} — total ₹${grandTotal.toFixed(2)}`);
      onCheckoutComplete();
    } catch (e) {
      onToast(`Checkout failed: ${e.message}`);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3>🧺 Your Cart</h3>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">Your cart is empty. Add crops from the Marketplace tab.</div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.crop.id}>
                  <img src={item.crop.image} alt={item.crop.name} />
                  <div className="cart-item-body">
                    <div className="cart-item-name">{item.crop.name}</div>
                    <div className="cart-item-meta">₹{item.crop.kisanPricePerKg.toFixed(2)}/kg · {item.crop.fpo}</div>
                    <div className="cart-qty-row">
                      <button onClick={() => onUpdateQty(item.crop.id, Math.max(5, item.quantityKg - 5))}>−</button>
                      <span>{item.quantityKg} kg</span>
                      <button onClick={() => onUpdateQty(item.crop.id, item.quantityKg + 5)}>+</button>
                      <button className="cart-remove" onClick={() => onRemove(item.crop.id)}>Remove</button>
                    </div>
                  </div>
                  <div className="cart-item-total">₹{(item.quantityKg * item.crop.kisanPricePerKg).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-grand-total">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              <button className="btn primary cart-checkout-btn" onClick={handleCheckout} disabled={placing}>
                {placing ? "Placing order…" : "Order Now"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
