const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DATA_PATH = path.join(__dirname, "..", "data", "stats.json");

router.get("/", (_req, res) => {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  res.json(JSON.parse(raw));
});

module.exports = router;
