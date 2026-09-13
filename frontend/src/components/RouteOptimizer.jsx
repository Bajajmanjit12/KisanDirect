import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { api } from "../api/client";

import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const vehicleIcon = new L.DivIcon({
  className: "vehicle-marker",
  html: `<div class="vehicle-marker-inner">🚚</div>`,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);

  return null;
}

export default function RouteOptimizer({ onToast }) {
  const [routeData, setRouteData] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRouteData();
    startLiveLocation();
  }, []);

  async function loadRouteData() {
    try {
      const result = await api.getRouteOptimizer();
      setRouteData(result.data || result);
    } catch (error) {
      console.error("Route data error:", error);
    } finally {
      setLoading(false);
    }
  }

  function startLiveLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: new Date().toLocaleTimeString(),
        };

        setLocation(currentLocation);
        setGpsEnabled(true);
        setLocationError("");
      },
      (error) => {
        setGpsEnabled(false);

        if (error.code === 1) {
          setLocationError(
            "Location permission denied. Please allow location access."
          );
        } else if (error.code === 2) {
          setLocationError("Current location is unavailable.");
        } else {
          setLocationError("Unable to retrieve GPS location.");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }

  if (loading) {
    return (
      <section className="route-page">
        <div className="route-loading">
          <div className="loading-spinner"></div>
          <h2>Loading AI Route Optimizer...</h2>
          <p>Connecting to route and telemetry services.</p>
        </div>
      </section>
    );
  }

  const vehicle = routeData?.vehicle || {};
  const metrics = routeData?.metrics || {};
  const telemetry = routeData?.telemetry || {};
  const waypoints = routeData?.waypoints || [];

  const fallbackPosition = [19.9975, 73.7898];

  const mapPosition = location
    ? [location.latitude, location.longitude]
    : fallbackPosition;

  const waypointPositions = waypoints
    .filter((point) => point.latitude && point.longitude)
    .map((point) => [point.latitude, point.longitude]);

  const routeLine = location
    ? [mapPosition, ...waypointPositions]
    : waypointPositions;

  return (
    <section className="route-page">
      <div className="route-container">
        {/* Header */}
        <div className="route-header">
          <div>
            <div className="route-breadcrumb">
              KisanDirect / AI Operations / Route Optimizer
            </div>

            <h1>AI Route Optimizer</h1>

            <p>
              Live vehicle tracking, optimized delivery routes, and logistics
              intelligence.
            </p>
          </div>

          <div className="route-header-actions">
            <span className={gpsEnabled ? "live-status" : "offline-status"}>
              <span className="live-dot"></span>
              {gpsEnabled ? "Live GPS Connected" : "GPS Not Connected"}
            </span>

            <button className="refresh-button" onClick={loadRouteData}>
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* GPS Status */}
        <div className="gps-banner">
          <div className="gps-banner-icon">📡</div>

          <div>
            <strong>
              {gpsEnabled
                ? "Live device location is active"
                : "Waiting for device location"}
            </strong>

            <p>
              {location
                ? `Last updated at ${location.timestamp}`
                : locationError ||
                  "Allow browser location permission to start tracking."}
            </p>
          </div>

          {location && (
            <div className="coordinates">
              <span>
                Lat: {location.latitude.toFixed(5)}
              </span>
              <span>
                Lng: {location.longitude.toFixed(5)}
              </span>
            </div>
          )}
        </div>

        {/* Vehicle Banner */}
        <div className="vehicle-banner">
          <div className="vehicle-icon">🚚</div>

          <div className="vehicle-info">
            <h2>{vehicle.name || "KisanDirect Delivery Vehicle"}</h2>
            <p>
              Vehicle ID: {vehicle.id || "KD-TRUCK-001"} · Driver:{" "}
              {vehicle.driver || "Assigned Driver"}
            </p>
          </div>

          <div className="vehicle-status">
            <span className="status-badge">
              {vehicle.status || "In Transit"}
            </span>
            <p>
              {location
                ? `GPS accuracy: ${Math.round(location.accuracy)} m`
                : "GPS accuracy unavailable"}
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="route-kpi-grid">
          <KpiCard
            icon="📍"
            title="Total Distance"
            value={`${metrics.totalDistance || 0} km`}
            subtitle="Optimized route distance"
          />

          <KpiCard
            icon="⏱️"
            title="Estimated Time"
            value={`${metrics.estimatedTime || 0} min`}
            subtitle="Expected delivery duration"
          />

          <KpiCard
            icon="⛽"
            title="Fuel Saved"
            value={`${metrics.fuelSaved || 0}%`}
            subtitle="Compared with normal route"
          />

          <KpiCard
            icon="🌱"
            title="CO₂ Reduction"
            value={`${metrics.co2Reduction || 0} kg`}
            subtitle="Estimated emissions reduction"
          />
        </div>

        {/* Map and Telemetry */}
        <div className="route-dashboard-grid">
          <div className="dashboard-card route-map-card">
            <div className="card-heading">
              <div>
                <h2>Live Delivery Map</h2>
                <p>
                  Real geographical map using OpenStreetMap and browser GPS
                </p>
              </div>

              <span className="route-label">
                {gpsEnabled ? "GPS Tracking" : "Demo Position"}
              </span>
            </div>

            <div className="live-map-wrapper">
              <MapContainer
                center={mapPosition}
                zoom={14}
                scrollWheelZoom={true}
                className="live-map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap position={mapPosition} />

                {location && (
                  <>
                    <Marker position={mapPosition} icon={vehicleIcon}>
                      <Popup>
                        <strong>KisanDirect Vehicle</strong>
                        <br />
                        Latitude: {location.latitude.toFixed(5)}
                        <br />
                        Longitude: {location.longitude.toFixed(5)}
                        <br />
                        Accuracy: {Math.round(location.accuracy)} m
                      </Popup>
                    </Marker>

                    <Circle
                      center={mapPosition}
                      radius={location.accuracy}
                      pathOptions={{
                        color: "#14b8a6",
                        fillColor: "#14b8a6",
                        fillOpacity: 0.12,
                      }}
                    />
                  </>
                )}

                {!location && (
                  <Marker position={fallbackPosition}>
                    <Popup>
                      Demo vehicle position. Allow GPS permission to show live
                      location.
                    </Popup>
                  </Marker>
                )}

                {waypoints.map((point, index) => {
                  if (!point.latitude || !point.longitude) return null;

                  return (
                    <Marker
                      key={point.id || index}
                      position={[point.latitude, point.longitude]}
                    >
                      <Popup>
                        <strong>{point.name}</strong>
                        <br />
                        {point.type || "Delivery Point"}
                        <br />
                        ETA: {point.eta || "Not available"}
                      </Popup>
                    </Marker>
                  );
                })}

                {routeLine.length > 1 && (
                  <Polyline
                    positions={routeLine}
                    pathOptions={{
                      color: "#8b5cf6",
                      weight: 5,
                      opacity: 0.85,
                    }}
                  />
                )}
              </MapContainer>
            </div>
          </div>

          <div className="route-side-column">
            <div className="dashboard-card">
              <div className="card-heading">
                <div>
                  <h2>Vehicle Telemetry</h2>
                  <p>Live vehicle parameters</p>
                </div>
                <span className="telemetry-icon">📡</span>
              </div>

              <div className="telemetry-list">
                <TelemetryRow
                  label="Latitude"
                  value={
                    location ? location.latitude.toFixed(5) : "Waiting..."
                  }
                  icon="🌐"
                />

                <TelemetryRow
                  label="Longitude"
                  value={
                    location ? location.longitude.toFixed(5) : "Waiting..."
                  }
                  icon="🌐"
                />

                <TelemetryRow
                  label="GPS Accuracy"
                  value={
                    location
                      ? `${Math.round(location.accuracy)} m`
                      : "Unavailable"
                  }
                  icon="📍"
                />

                <TelemetryRow
                  label="Current Speed"
                  value={
                    location?.speed
                      ? `${(location.speed * 3.6).toFixed(1)} km/h`
                      : `${telemetry.speed || 0} km/h`
                  }
                  icon="🚀"
                />

                <TelemetryRow
                  label="Engine Status"
                  value={telemetry.engineStatus || "Running"}
                  icon="⚙️"
                />
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-heading">
                <div>
                  <h2>Route Intelligence</h2>
                  <p>AI recommendations</p>
                </div>
                <span className="ai-icon">✦</span>
              </div>

              <div className="ai-recommendation">
                <div className="recommendation-icon">✓</div>
                <div>
                  <strong>Live tracking enabled</strong>
                  <p>
                    The vehicle marker updates automatically whenever the
                    device reports a new GPS position.
                  </p>
                </div>
              </div>

              <div className="ai-recommendation">
                <div className="recommendation-icon">!</div>
                <div>
                  <strong>GPS permission required</strong>
                  <p>
                    If tracking is unavailable, allow location permission in
                    your browser settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Waypoints */}
        <div className="dashboard-card waypoint-card">
          <div className="card-heading">
            <div>
              <h2>Delivery Waypoints</h2>
              <p>Collection and delivery points in the optimized route</p>
            </div>
          </div>

          <div className="waypoint-list">
            {waypoints.length > 0 ? (
              waypoints.map((point, index) => (
                <div className="waypoint-row" key={point.id || index}>
                  <div className="waypoint-number">{index + 1}</div>

                  <div className="waypoint-details">
                    <strong>{point.name || `Waypoint ${index + 1}`}</strong>
                    <span>
                      {point.type || "Delivery Point"}{" "}
                      {point.quantity ? `· ${point.quantity} kg` : ""}
                    </span>
                  </div>

                  <div className="waypoint-time">
                    {point.eta || "--:--"}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-text">
                No waypoint coordinates are available.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function KpiCard({ icon, title, value, subtitle }) {
  return (
    <div className="route-kpi-card">
      <div className="kpi-icon">{icon}</div>

      <div className="kpi-content">
        <p>{title}</p>
        <h2>{value}</h2>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

function TelemetryRow({ icon, label, value }) {
  return (
    <div className="telemetry-row">
      <div className="telemetry-label">
        <span>{icon}</span>
        {label}
      </div>

      <strong>{value}</strong>
    </div>
  );
}