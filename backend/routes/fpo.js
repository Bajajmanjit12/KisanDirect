const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const BATCHES_PATH = path.join(__dirname, "..", "data", "fpo-batches.json");
const STATS_PATH = path.join(__dirname, "..", "data", "fpo-stats.json");

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}
function writeJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

// GET /api/fpo/summary -> stats + fpoName + batches, everything the Hub page needs in one call
router.get("/summary", (_req, res) => {
  const stats = readJSON(STATS_PATH);
  const batches = readJSON(BATCHES_PATH);
  res.json({ ...stats, batches });
});

// GET /api/fpo/batches
router.get("/batches", (_req, res) => {
  res.json({ batches: readJSON(BATCHES_PATH) });
});

// POST /api/fpo/batches -> "List New Harvest Lot"
router.post("/batches", (req, res) => {
  const body = req.body || {};
  if (!body.cropName || !body.quantity || !body.directRatePerKg) {
    return res.status(400).json({ error: "cropName, quantity and directRatePerKg are required" });
  }

  const batches = readJSON(BATCHES_PATH);
  const stats = readJSON(STATS_PATH);

  const newBatch = {
    id: `LOT-${900 + batches.length + Math.floor(Math.random() * 90)}`,
    cropName: body.cropName,
    cropId: body.cropId || null,
    origin: body.origin || "Unspecified Farmgate",
    quantity: Number(body.quantity),
    unit: body.unit || "Quintals",
    qualityGrade: body.qualityGrade || "Pending QC",
    gradeTone: "blue",
    directRatePerKg: Number(body.directRatePerKg),
    mandiRatePerKg: Number(body.mandiRatePerKg) || 0,
    scheduledPickup: body.scheduledPickup || "Awaiting scheduling",
    status: "Listed",
    statusTone: "blue"
  };

  batches.unshift(newBatch);
  writeJSON(BATCHES_PATH, batches);

  stats.stats.activeBatchesListed.value += 1;
  stats.stats.activeBatchesListed.display = `${stats.stats.activeBatchesListed.value} Lots`;
  writeJSON(STATS_PATH, stats);

  res.status(201).json(newBatch);
});

module.exports = router;
