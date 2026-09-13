const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DATA_PATH = path.join(__dirname, "..", "data", "scanner-samples.json");

function readSamples() {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

// GET /api/scanner/samples -> list of selectable test harvest samples
router.get("/samples", (_req, res) => {
  res.json({ samples: readSamples() });
});

// GET /api/scanner/samples/:id -> full AI scan result for one sample
router.get("/samples/:id", (req, res) => {
  const sample = readSamples().find((s) => s.id === req.params.id);
  if (!sample) return res.status(404).json({ error: "Sample not found" });
  res.json(sample);
});

module.exports = router;
