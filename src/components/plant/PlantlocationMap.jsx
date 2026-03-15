// ======================================================
// 🌍 PLANT LOCATION MAP - ENTERPRISE V3 READY
// Auto Fit | Resize Safe | Multi-Plant | Production Safe
// ======================================================

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./PlantLocationMap.css";

// ======================================================
// 🔄 Auto Fit Bounds Component
// ======================================================
function FitBounds({ plants }) {
  const map = useMap();

  useEffect(() => {
    if (!plants.length) return;

    const bounds = L.latLngBounds(
      plants.map((p) => [
        p.identity.latitude,
        p.identity.longitude
      ])
    );

    map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 8
    });

    // Fix resize rendering bug
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [plants, map]);

  return null;
}

// ======================================================
// 🎯 Main Component
// ======================================================
export default function PlantLocationMap({ data }) {
  const plants = useMemo(() => {
    return (
      data?.plants?.filter(
        (p) =>
          p?.identity?.latitude != null &&
          p?.identity?.longitude != null
      ) || []
    );
  }, [data]);

  if (!plants.length) {
    return (
      <div className="map-card">
        <div className="map-empty">
          No valid plant coordinates available
        </div>
      </div>
    );
  }

  const getMarkerColor = (score) => {
    if (score >= 90) return "#16a34a"; // green
    if (score >= 75) return "#f59e0b"; // amber
    return "#dc2626"; // red
  };

  return (
    <div className="map-card">

      {/* ================= HEADER ================= */}
      <div className="map-header">
        <div>
          <h2 className="map-title">
            Portfolio Intelligence Map
          </h2>
          <p className="map-subtitle">
            Geographic performance & AI intelligence overview
          </p>
        </div>

        <div className="map-badge">
          {plants.length} PLANTS
        </div>
      </div>

      {/* ================= MAP ================= */}
      <div className="map-wrapper">
        <MapContainer
          center={[plants[0].identity.latitude, plants[0].identity.longitude]}
          zoom={6}
          scrollWheelZoom={false}
          className="leaflet-map"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds plants={plants} />

          {plants.map((plant) => {
            const score =
              plant?.summary?.overall_intelligence_score ?? 0;

            const color = getMarkerColor(score);

            return (
              <CircleMarker
                key={plant.identity.plant_id}
                center={[
                  plant.identity.latitude,
                  plant.identity.longitude
                ]}
                radius={10}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.85,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="popup-card">
                    <h3>{plant.identity.plant_name}</h3>

                    <div className="popup-grid">
                      <span>Capacity</span>
                      <span>
                        {Number(
                          plant.identity.capacity_kw
                        ).toLocaleString()} kW
                      </span>

                      <span>Generation</span>
                      <span>
                        {Number(
                          plant.summary.today_generation_kwh
                        ).toLocaleString()} kWh
                      </span>

                      <span>PR</span>
                      <span>
                        {plant.summary.plant_performance_ratio}%
                      </span>

                      <span>AI Score</span>
                      <span>{score}</span>

                      <span>Alerts</span>
                      <span>
                        {plant.summary.active_alerts}
                      </span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}