const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DATA_PATH = path.join(__dirname, "..", "data", "crops.json");

function readCrops() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeCrops(crops) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(crops, null, 2));
}

// GET /api/crops?search=onion&category=Vegetables
router.get("/", (req, res) => {
  const { search = "", category = "All Crops" } = req.query;
  let crops = readCrops();

  if (category && category !== "All Crops") {
    crops = crops.filter((c) => c.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    crops = crops.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.fpo.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }

  res.json({ count: crops.length, crops });
});

// GET /api/crops/:id
router.get("/:id", (req, res) => {
  const crops = readCrops();
  const crop = crops.find((c) => c.id === req.params.id);
  if (!crop) return res.status(404).json({ error: "Crop not found" });
  res.json(crop);
});

// POST /api/crops  (used by Farmer & FPO Hub tab to list new produce)
router.post("/", (req, res) => {
  const crops = readCrops();
  const body = req.body || {};

  if (!body.name || !body.category || !body.kisanPricePerKg) {
    return res.status(400).json({ error: "name, category and kisanPricePerKg are required" });
  }

  const newCrop = {
    id: `${body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
    name: body.name,
    category: body.category,
    location: body.location || "Unknown",
    fpo: body.fpo || "Independent Farmer",
    harvested: body.harvested || new Date().toISOString().slice(0, 10),
    unit: body.unit || "Quintals",
    available: Number(body.available) || 0,
    mandiPricePerKg: Number(body.mandiPricePerKg) || 0,
    kisanPricePerKg: Number(body.kisanPricePerKg),
    farmerGetsPerKg: Number(body.farmerGetsPerKg) || Number(body.kisanPricePerKg) * 0.72,
    farmerUpliftPct: Number(body.farmerUpliftPct) || 0,
    consumerSavingsPct: Number(body.consumerSavingsPct) || 0,
    tags: body.tags || [],
    image: body.image || ""
  };

  crops.push(newCrop);
  writeCrops(crops);
  res.status(201).json(newCrop);
});

module.exports = router;
