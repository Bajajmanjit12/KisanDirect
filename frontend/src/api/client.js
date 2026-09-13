const BASE = "/api";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with ${res.status}`);
  }
  return res.json();
}

export const api = {
  getStats: () => fetch(`${BASE}/stats`).then(handle),

  getCrops: ({ search = "", category = "All Crops" } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    return fetch(`${BASE}/crops?${params.toString()}`).then(handle);
  },

  placeOrder: (payload) =>
    fetch(`${BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(handle),

  checkoutCart: (items) =>
    fetch(`${BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    }).then(handle),

  listOrders: () => fetch(`${BASE}/orders`).then(handle),

  getFpoSummary: () => fetch(`${BASE}/fpo/summary`).then(handle),

  listNewHarvestLot: (payload) =>
    fetch(`${BASE}/fpo/batches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(handle),

  getScannerSamples: () =>
    fetch(`${BASE}/scanner/samples`).then(handle),

  getScannerSample: (id) =>
    fetch(`${BASE}/scanner/samples/${id}`).then(handle),

  // =====================================
  // AI ROUTE OPTIMIZER
  // =====================================

  // Get complete route dashboard data
  getRouteOptimizer: () =>
    fetch(`${BASE}/route-optimizer`).then(handle),

  // Get current vehicle telemetry
  getRouteTelemetry: () =>
    fetch(`${BASE}/route-optimizer/telemetry`).then(handle),

  // Update vehicle / reefer telemetry
  updateRouteTelemetry: (payload) =>
    fetch(`${BASE}/route-optimizer/telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(handle),

  // Simulate spoilage, traffic, or clear event
  simulateRouteEvent: (eventType) =>
    fetch(`${BASE}/route-optimizer/simulate-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType })
    }).then(handle)
};