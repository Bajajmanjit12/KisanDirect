const express = require("express");

const router = express.Router();

// In-memory order store for MVP (resets on server restart)
let orders = [];
let nextId = 1;

function buildOrder(item) {
  const { cropId, cropName, quantityKg, pricePerKg } = item;
  return {
    id: nextId++,
    cropId,
    cropName,
    quantityKg: Number(quantityKg),
    pricePerKg: Number(pricePerKg),
    total: Number(quantityKg) * Number(pricePerKg),
    status: "Confirmed",
    createdAt: new Date().toISOString()
  };
}

// GET /api/orders
router.get("/", (_req, res) => {
  res.json({ count: orders.length, orders });
});

// POST /api/orders
// Accepts either a single item: { cropId, cropName, quantityKg, pricePerKg }
// or a full cart checkout:      { items: [ { cropId, cropName, quantityKg, pricePerKg }, ... ] }
router.post("/", (req, res) => {
  const body = req.body || {};

  if (Array.isArray(body.items)) {
    if (body.items.length === 0) {
      return res.status(400).json({ error: "items array cannot be empty" });
    }
    for (const item of body.items) {
      if (!item.cropId || !item.quantityKg || !item.pricePerKg) {
        return res.status(400).json({ error: "each item needs cropId, quantityKg and pricePerKg" });
      }
    }
    const created = body.items.map(buildOrder);
    orders.push(...created);
    const grandTotal = created.reduce((sum, o) => sum + o.total, 0);
    return res.status(201).json({ orders: created, grandTotal });
  }

  const { cropId, quantityKg, pricePerKg } = body;
  if (!cropId || !quantityKg || !pricePerKg) {
    return res.status(400).json({ error: "cropId, quantityKg and pricePerKg are required" });
  }

  const order = buildOrder(body);
  orders.push(order);
  res.status(201).json(order);
});

module.exports = router;
