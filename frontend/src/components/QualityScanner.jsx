import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function QualityScanner({ onToast }) {
  const [samples, setSamples] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getScannerSamples()
      .then((data) => {
        setSamples(data.samples);
        const first = data.samples[0];
        if (first) {
          setActiveId(first.id);
          setActive(first);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const selectSample = (id) => {
    setActiveId(id);
    api
      .getScannerSample(id)
      .then(setActive)
      .catch((e) => onToast(`Couldn't load sample: ${e.message}`));
  };

  if (loading) return <div className="loading-state">Calibrating AI Quality Scanner…</div>;
  if (error) return <div className="empty-state">Couldn't reach the backend: {error}</div>;

  return (
    <div className="scanner-wrap">
      <p className="scanner-subtitle">
        Eliminating middleman grading fraud through automated neural defect detection, ripeness
        scoring, and tamper-proof DOCA QC certificates.
      </p>

      <div className="scanner-grid">
        <div className="scanner-panel">
          <div className="scanner-image-wrap">
            {active && (
              <>
                <div className="scanner-detect-label">
                  <span>⊙</span> {active.detectLabel}
                </div>
                <img src={active.image} alt={active.label} />
              </>
            )}
          </div>

          <div className="scanner-sample-label">Select Test Harvest Sample:</div>
          <div className="scanner-samples">
            {samples.map((s) => (
              <button
                key={s.id}
                className={`sample-chip ${activeId === s.id ? "active" : ""}`}
                onClick={() => selectSample(s.id)}
              >
                <span>{s.emoji}</span> {s.label}
              </button>
            ))}
          </div>
        </div>

        {active && (
          <div className="scanner-results">
            <div className="grade-card">
              <div className="grade-card-head">
                <span className="stat-label">AI Verified Quality Grade</span>
                <span className="freshness-label">
                  Freshness Index
                  <div className="freshness-value">{active.freshnessIndexPct}%</div>
                </span>
              </div>
              <div className="grade-value">{active.grade}</div>
            </div>

            <div className="ripeness-block">
              <div className="ripeness-head">
                <span>Color &amp; Ripeness Index</span>
                <span>{active.colorRipenessPct}% ({active.colorRipenessLabel})</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${active.colorRipenessPct}%` }} />
              </div>
            </div>

            <div className="scanner-metrics">
              <div className="metric-row">
                <span>Surface Blemish Rate:</span>
                <span className="metric-value">{active.surfaceBlemishRate}</span>
              </div>
              <div className="metric-row">
                <span>Calibrated Diameter:</span>
                <span className="metric-value">{active.calibratedDiameter}</span>
              </div>
              <div className="metric-row">
                <span>Firmness &amp; Transit Life:</span>
                <span className="metric-value">{active.firmnessTransitLife}</span>
              </div>
              <div className="metric-row">
                <span>Fair Farmgate Premium:</span>
                <span className="metric-value">{active.fairFarmgatePremium}</span>
              </div>
            </div>

            <div className="hash-box">
              <div className="hash-title">🛡️ DOCA Anti-Fraud Digital QC Hash</div>
              <div className="hash-value">SHA256: {active.qcHash}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
