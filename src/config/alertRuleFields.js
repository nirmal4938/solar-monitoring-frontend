// /config/alertRuleFields.js
export const ALERT_RULE_FIELDS = {
  PLANT: [
    { field: "power_kw", label: "Power", unit: "kW", type: "number" },
    { field: "import_kw", label: "Grid Import", unit: "kW", type: "number" },
    { field: "export_kw", label: "Grid Export", unit: "kW", type: "number" },
    { field: "irradiance_wm2", label: "Solar Irradiance", unit: "W/m²", type: "number" },
    { field: "load_kw", label: "Load Consumption", unit: "kW", type: "number" }
  ],
  INVERTER: [
    { field: "status", label: "Inverter Status", unit: null, type: "string" },
    { field: "temperature_c", label: "Temperature", unit: "°C", type: "number" },
    { field: "conversion_efficiency_pct", label: "Conversion Efficiency", unit: "%", type: "number" },
    { field: "power_kw", label: "Power Output", unit: "kW", type: "number" }
  ],
  BATTERY: [
    { field: "soc_percent", label: "State of Charge", unit: "%", type: "number" },
    { field: "battery_temperature_c", label: "Battery Temperature", unit: "°C", type: "number" },
    { field: "health_pct", label: "Battery Health", unit: "%", type: "number" },
    { field: "charge_kw", label: "Charging Power", unit: "kW", type: "number" },
    { field: "discharge_kw", label: "Discharging Power", unit: "kW", type: "number" }
  ],
  ORGANIZATION: [
    { field: "performance_ratio", label: "Performance Ratio", unit: "%", type: "number" },
    { field: "grid_dependency_pct", label: "Grid Dependency", unit: "%", type: "number" },
    { field: "avoided_emissions_tonnes", label: "Avoided Emissions", unit: "tonnes", type: "number" }
  ]
};