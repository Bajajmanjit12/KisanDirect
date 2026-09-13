const express = require("express");
const cors = require("cors");

const cropsRouter = require("./routes/crops");
const statsRouter = require("./routes/stats");
const ordersRouter = require("./routes/orders");
const fpoRouter = require("./routes/fpo");
const scannerRouter = require("./routes/scanner");
const routeOptimizerRoutes = require("./routes/routeOptimizer");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// simple request logger - helpful while wiring up the frontend
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "kisandirect-backend", time: new Date().toISOString() });
});

app.use("/api/crops", cropsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/fpo", fpoRouter);
app.use("/api/scanner", scannerRouter);
app.use("/api/route-optimizer", routeOptimizerRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
});

// error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`KisanDirect backend running on http://localhost:${PORT}`);
});
