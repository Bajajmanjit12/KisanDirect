import { useEffect, useState } from "react";
import { api } from "../api/client";

const STAT_META = {
  directPayoutsRealized: { icon: "💳", bg: "rgba(34,197,94,0.14)", label: "Direct Payouts Realized" },
  activeBatchesListed: { icon: "📦", bg: "rgba(240,180,41,0.14)", label: "Active Batches Listed" },
  logisticsPickupsScheduled: { icon: "🚚", bg: "rgba(59,130,246,0.14)", label: "Logistics Pickups Scheduled" },
  averageRealizationPremium: { icon: "📈", bg: "rgba(139,92,246,0.14)", label: "Average Realization Premium" }
};

const STATUS_TONE_CLASS = {
  orange: "status-badge orange",
  blue: "status-badge blue",
  green: "status-badge green"
};

const GRADE_TONE_CLASS = {
  green: "grade-pill green",
  blue: "grade-pill blue"
};

const EMPTY_FORM = {
  cropName: "",
  origin: "",
  quantity: "",
  unit: "Quintals",
  directRatePerKg: "",
  mandiRatePerKg: ""
};

export default function FarmerFpoHub({ onToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .getFpoSummary()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cropName || !form.quantity || !form.directRatePerKg) {
      onToast("Crop name, quantity and direct rate are required");
      return;
    }
    setSubmitting(true);
    try {
      await api.listNewHarvestLot(form);
      onToast(`Listed new harvest lot: ${form.cropName}`);
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch (err) {
      onToast(`Failed to list lot: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Loading Farmer & FPO Hub…</div>;
  if (error) return <div className="empty-state">Couldn't reach the backend: {error}</div>;

  return (
    <div className="hub-wrap">
      <div className="hub-header">
        <div>
          <h2>🚜 Farmer & FPO Producer Portal</h2>
          <p>Manage harvest batches, schedule farmgate reefer pickups, and compare APMC mandi cartels vs direct payouts.</p>
        </div>
        <button className="btn primary btn-list-lot" onClick={() => setShowForm(true)}>
          ＋ List New Harvest Lot
        </button>
      </div>

      <div className="stats-grid">
        {Object.entries(data.stats).map(([key, stat]) => {
          const meta = STAT_META[key] || { icon: "📊", bg: "rgba(255,255,255,0.08)", label: key };
          return (
            <div className="stat-card" key={key}>
              <div className="stat-icon" style={{ background: meta.bg }}>{meta.icon}</div>
              <div className="stat-label">{meta.label}</div>
              <div className="stat-value">{stat.display}</div>
              <div className="stat-delta">
                <span>✓</span>
                <span>{stat.delta}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hub-table-card">
        <div className="hub-table-head">
          <h3>Live Farm Listings &amp; Scheduled Dispatches</h3>
          <span className="nav-pill">FPO: {data.fpoName}</span>
        </div>

        <div className="hub-table-scroll">
          <table className="hub-table">
            <thead>
              <tr>
                <th>Batch ID &amp; Crop</th>
                <th>Quantity</th>
                <th>Quality Grade</th>
                <th>Direct Farmgate Rate</th>
                <th>Mandi Comparison</th>
                <th>Scheduled Pickup</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.batches.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="batch-id">#{b.id}: {b.cropName}</div>
                    <div className="batch-origin">{b.origin}</div>
                  </td>
                  <td>{b.quantity} {b.unit}</td>
                  <td>
                    <span className={GRADE_TONE_CLASS[b.gradeTone] || "grade-pill green"}>{b.qualityGrade}</span>
                  </td>
                  <td className="rate-cell">₹{b.directRatePerKg.toFixed(2)} / kg</td>
                  <td className="mandi-cell">
                    APMC: <s>₹{b.mandiRatePerKg.toFixed(2)} / kg</s>
                  </td>
                  <td>{b.scheduledPickup}</td>
                  <td>
                    <span className={STATUS_TONE_CLASS[b.statusTone] || "status-badge blue"}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>List New Harvest Lot</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>
                Crop name
                <input value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })} placeholder="e.g. Nashik Red Onion" />
              </label>
              <label>
                Farmgate origin
                <input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="e.g. Lasalgaon Farmgate" />
              </label>
              <div className="modal-form-row">
                <label>
                  Quantity
                  <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="450" />
                </label>
                <label>
                  Unit
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                    <option>Quintals</option>
                    <option>Crates</option>
                    <option>Tonnes</option>
                  </select>
                </label>
              </div>
              <div className="modal-form-row">
                <label>
                  Direct rate (₹/kg)
                  <input type="number" step="0.01" value={form.directRatePerKg} onChange={(e) => setForm({ ...form, directRatePerKg: e.target.value })} placeholder="24.50" />
                </label>
                <label>
                  Mandi rate (₹/kg)
                  <input type="number" step="0.01" value={form.mandiRatePerKg} onChange={(e) => setForm({ ...form, mandiRatePerKg: e.target.value })} placeholder="16.00" />
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn primary" disabled={submitting}>
                  {submitting ? "Listing…" : "List Lot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
