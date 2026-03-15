# ☀️ Solar Monitoring SCADA Platform (MVP)

A modern **Solar Monitoring & Energy Intelligence Platform** designed for industrial, commercial, and utility solar plants.

This project simulates a **lightweight SCADA system** capable of monitoring solar generation, battery storage, grid interaction, and energy analytics with an enterprise-ready architecture.

The system is built as a **multi-tenant SaaS platform** supporting organizations, plants, devices, telemetry streams, alerts, and ESG intelligence.

---

# 🌐 Live Architecture

Frontend: React + Vite
Backend: Node.js + Express
Database: MongoDB Atlas
Deployment:

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

# 🎯 MVP Scope (Phase-1)

The MVP focuses on **core solar monitoring capabilities** needed to run a solar plant dashboard.

## 1️⃣ Multi-Tenant Platform

Organizations can manage multiple solar plants.

Features:

- Organization accounts
- Multiple users per organization
- Subscription tiers
- Plant-level access control

Core tables:

- organizations
- users
- plants

---

## 2️⃣ Enterprise RBAC System

Role-based access control ensures secure plant operations.

Roles include:

- SUPER_ADMIN
- ENERGY_MANAGER
- ESG_AUDITOR

Capabilities:

- Role → Permission mapping
- User → Role mapping
- Optional plant-level restrictions

Core tables:

- roles
- permissions
- role_permissions
- user_roles
- user_plant_access

---

## 3️⃣ Solar Plant Infrastructure

The system models physical plant components.

Supported infrastructure:

- Solar Plants
- Inverters
- Battery Energy Storage Systems (BESS)

Core tables:

- plants
- inverters
- batteries

---

## 4️⃣ Telemetry & Data Logging

The platform collects operational telemetry from devices.

Supported logs:

Solar Generation

- power
- energy
- voltage
- current

Battery Telemetry

- state of charge
- charge / discharge
- temperature
- health

Grid Interaction

- import / export power
- energy flow

Weather Data

- solar irradiance
- temperature
- wind speed

Core tables:

- generation_logs
- battery_logs
- grid_logs
- consumption_logs
- weather_logs

---

## 5️⃣ Energy Analytics Engine

The system generates aggregated metrics for operational analysis.

Daily summaries include:

- total solar generation
- peak generation
- self-consumption ratio
- grid dependency
- battery utilization
- net energy balance

Core tables:

- daily_energy_summary
- performance_metrics

---

## 6️⃣ Billing & Tariff Engine

Tracks energy imports, exports, and cost impact.

Capabilities:

- grid tariff configuration
- import/export energy calculation
- monthly billing summary
- battery arbitrage savings

Core tables:

- tariff_config
- billing_summary

---

## 7️⃣ Alert Engine (Enterprise Design)

A flexible alert rule engine detects anomalies and system issues.

Alert categories:

- Operational alerts
- Performance alerts
- Financial alerts
- ESG alerts

Features:

- configurable alert rules
- severity levels
- rule cooldown
- notification channels

Core tables:

- alert_rules
- alerts

---

## 8️⃣ Maintenance Tracking

Tracks equipment maintenance events.

Examples:

- inverter replacement
- fault repair
- inspection records

Core tables:

- maintenance_logs

---

# 🧠 Future Intelligence Layer (Post-MVP)

The schema already includes support for advanced analytics.

## Forecasting

Predict solar generation based on weather models.

Tables:

- daily_forecast
- forecast_deviation

---

## AI Performance Intelligence

AI-generated operational KPIs.

Examples:

- efficiency score
- anomaly detection score
- reliability score
- grid dependency risk

Table:

- ai_kpi_scores

---

## Carbon & ESG Intelligence

Tracks environmental impact and sustainability metrics.

Features:

- avoided emissions calculation
- carbon credit valuation
- ESG reporting

Tables:

- carbon_impact_summary
- carbon_factors
- carbon_credit_market
- environmental_equivalency_factors
- esg_reports

---

# 🏗 System Architecture

User
↓
Frontend Dashboard (React + Vite)
↓
Backend API (Node.js + Express)
↓
Telemetry + Business Logic
↓
MongoDB Database

---

# 📊 Key Platform Capabilities

Solar Monitoring
Battery Energy Storage Monitoring
Grid Import / Export Tracking
Energy Analytics
Operational Alerts
Billing Insights
Carbon Impact Tracking

---

# 🚀 Future Roadmap

Phase-2 features planned:

Real-time telemetry streaming
SCADA device integrations (Modbus / MQTT)
AI anomaly detection
Predictive maintenance
Energy forecasting models
Carbon credit marketplace integration
Enterprise ESG reporting

---

# 📌 Project Goal

Build a **modern open architecture solar SCADA platform** capable of scaling from small commercial solar plants to enterprise multi-site energy monitoring systems.

---

# 👨‍💻 Author

Nirmal Kumar

Solar Monitoring SaaS / Energy Intelligence Platform
