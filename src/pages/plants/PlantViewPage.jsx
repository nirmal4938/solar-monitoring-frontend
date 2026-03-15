import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { useAuth } from "../../context/AuthContext";
import { useEditPlant } from "../../hooks/useEditPlant";
import './HeaderOrganism.css'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const PlantViewPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { plant, loading } = useEditPlant(id);

  const trendData = useMemo(() => {

    if (!plant?.solarGenerationTrend) return [];

    return [
      {
        label: "Today",
        forecast: plant.solarGenerationTrend.forecast_energy_kwh,
        actual: plant.solarGenerationTrend.actual_energy_kwh,
        deviation: plant.solarGenerationTrend.deviationPct,
      },
    ];

  }, [plant]);

  if (loading || !plant) return <div className="bb-loading">Loading...</div>;

  return (
    <div className="bb-page">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

<div className="bb-header">

  <div className="bb-header-left">

    <div className="bb-breadcrumb">
      <i className="pi pi-home"></i>
      <span>Plants</span>
      <i className="pi pi-angle-right"></i>
      <span className="current">{plant.name}</span>
    </div>

    <div className="bb-title-row">

      <h1 className="bb-title">{plant.name}</h1>

      <span
        className={`bb-status-dot ${
          plant.active_alerts_count > 0 ? "alert" : "healthy"
        }`}
      ></span>

    </div>

    <div className="bb-header-meta">

      <Tag
        value={plant.plant_type}
        icon="pi pi-bolt"
        severity="info"
        rounded
      />

      <span className="bb-meta-item">
        <i className="pi pi-map-marker"></i>
        {plant.location}
      </span>

      <Tag
        value={
          plant.active_alerts_count > 0
            ? "Attention Needed"
            : "Operating Normally"
        }
        icon={
          plant.active_alerts_count > 0
            ? "pi pi-exclamation-triangle"
            : "pi pi-check-circle"
        }
        severity={plant.active_alerts_count > 0 ? "danger" : "success"}
        rounded
      />

      {plant.capacity_kw && (
        <span className="bb-meta-item">
          <i className="pi pi-chart-line"></i>
          {plant.capacity_kw} kW
        </span>
      )}

    </div>
  </div>

  <div className="bb-actions">

    <Button
      icon="pi pi-arrow-left"
      label="Back"
      className="p-button-text p-button-sm"
      onClick={() => navigate("/plants")}
    />

    {hasPermission("PLANT_EDIT") && (
      <Button
        icon="pi pi-pencil"
        label="Edit Plant"
        className="p-button-sm CTA-Button"
        onClick={() => navigate(`/plants/${plant.id}/edit`)}
        rounded
      />
    )}

  </div>

</div>


      {/* ================================================= */}
      {/* KPI PANEL */}
      {/* ================================================= */}

      <div className="bb-kpi-grid">

        <div className="bb-kpi">
          <span>Installed Capacity</span>
          <strong>{plant.capacity_kw} kW</strong>
        </div>

        <div className="bb-kpi">
          <span>Commissioned</span>
          <strong>{plant.commissioning_date}</strong>
        </div>

        <div className="bb-kpi">
          <span>Latest Generation</span>
          <strong>{plant.latest_generation_kwh || "-"} kWh</strong>
        </div>

        <div className="bb-kpi">
          <span>Performance Ratio</span>
          <strong>{plant.performance_ratio || "-"} %</strong>
        </div>

        <div className="bb-kpi">
          <span>AI Efficiency Score</span>
          <strong>{plant.energy_efficiency_score || "-"}</strong>
        </div>

        <div className="bb-kpi">
          <span>Active Alerts</span>

          <Tag
            value={plant.active_alerts_count || 0}
            severity={plant.active_alerts_count > 0 ? "danger" : "success"}
          />

        </div>

      </div>


      {/* ================================================= */}
      {/* PERFORMANCE ANALYTICS */}
      {/* ================================================= */}

      {trendData.length > 0 && (

        <Card title="Generation Forecast vs Actual" className="bb-card">

          <ResponsiveContainer width="100%" height={320}>

            <LineChart data={trendData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="label" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#2563eb"
                strokeWidth={3}
                name="Forecast kWh"
              />

              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10b981"
                strokeWidth={3}
                name="Actual kWh"
              />

              <Line
                type="monotone"
                dataKey="deviation"
                stroke="#ef4444"
                strokeWidth={2}
                name="Deviation %"
              />

            </LineChart>

          </ResponsiveContainer>

        </Card>

      )}


      {/* ================================================= */}
      {/* OPERATIONS GRID */}
      {/* ================================================= */}

      <div className="bb-grid">

        <Card title="System Health">

          <div className="bb-stat-grid">

            <div>
              <span>Status</span>
              <Tag value="Operational" severity="success" />
            </div>

            <div>
              <span>Energy Efficiency</span>
              <strong>{plant.energy_efficiency_score || "-"}</strong>
            </div>

            <div>
              <span>Performance Ratio</span>
              <strong>{plant.performance_ratio || "-"} %</strong>
            </div>

            <div>
              <span>Alerts</span>
              <strong>{plant.active_alerts_count || 0}</strong>
            </div>

          </div>

        </Card>


        <Card title="Infrastructure">

          <div className="bb-stat-grid">

            <div>
              <span>Inverters</span>
              <strong>{plant.inverter_count || 0}</strong>
            </div>

            <div>
              <span>Batteries</span>
              <strong>{plant.battery_count || 0}</strong>
            </div>

          </div>

        </Card>


        <Card title="Environmental Impact">

          <div className="bb-stat-grid">

            <div>
              <span>CO₂ Avoided</span>
              <strong>{plant.avoided_emissions_kg || "-"} kg</strong>
            </div>

            <div>
              <span>Trees Equivalent</span>
              <strong>{plant.trees_equivalent || "-"}</strong>
            </div>

          </div>

        </Card>


        <Card title="Geo Coordinates">

          <div className="bb-stat-grid">

            <div>
              <span>Latitude</span>
              <strong>{plant.latitude}</strong>
            </div>

            <div>
              <span>Longitude</span>
              <strong>{plant.longitude}</strong>
            </div>

          </div>

        </Card>

      </div>



      {/* ================================================= */}
      {/* ENTERPRISE CSS */}
      {/* ================================================= */}

      <style>{`

      .bb-page{
        padding:28px;
        background:#f8fafc;
        min-height:100vh;
      }

      .bb-loading{
        padding:40px;
      }

      .bb-header{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        margin-bottom:28px;
      }

      .bb-title{
        font-size:28px;
        margin:0;
        font-weight:600;
      }

      .bb-breadcrumb{
        font-size:13px;
        color:#64748b;
        margin-bottom:6px;
      }

      .bb-header-meta{
        display:flex;
        gap:10px;
        align-items:center;
        margin-top:6px;
      }

      .bb-location{
        font-size:13px;
        color:#64748b;
      }

      .bb-actions{
        display:flex;
        gap:10px;
      }

      .bb-kpi-grid{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
        gap:16px;
        margin-bottom:28px;
      }

      .bb-kpi{
        background:white;
        border-radius:10px;
        padding:16px;
        box-shadow:0 2px 6px rgba(0,0,0,0.06);
        display:flex;
        flex-direction:column;
        gap:6px;
      }

      .bb-kpi span{
        font-size:12px;
        color:#64748b;
      }

      .bb-kpi strong{
        font-size:20px;
        font-weight:600;
      }

      .bb-card{
        margin-bottom:26px;
      }

      .bb-grid{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
        gap:18px;
      }

      .bb-stat-grid{
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:18px;
      }

      .bb-stat-grid span{
        font-size:12px;
        color:#64748b;
        display:block;
        margin-bottom:4px;
      }

      .bb-stat-grid strong{
        font-size:16px;
        font-weight:600;
      }

      `}</style>

    </div>
  );

};