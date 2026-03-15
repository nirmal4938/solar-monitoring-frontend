export const inverterIntelligenceMock = {
  api_version: "v1",
  generated_at: "2026-02-25T11:10:00Z",

  tenant: {
    organization_id: "org_uuid",
    plant_id: "plant_uuid",
    plant_name: "Plant Alpha",
    plant_type: "INDUSTRIAL"
  },

  permissions: {
    can_view_financials: true,
    can_view_ai_scores: true,
    can_control_inverter: true,
    can_schedule_maintenance: true
  },

  summary: {
    inverter_count: 4,
    online_count: 3,
    fault_count: 1,
    total_capacity_kw: 2000,
    active_alerts: 3,
    plant_performance_ratio: 82.4,
    availability_pct: 98.2
  },

  inverters: [

    // ================================
    // ⚡ INV-A1
    // ================================
    {
      identity: {
        inverter_id: "inv_a1",
        name: "Inverter A1 - East Block",
        serial_number: "SN-A1-2024",
        commissioning_date: "2024-01-10"
      },

      specifications: {
        capacity_kw: 500,
        inverter_type: "STRING",
        manufacturer: "SMA",
        model: "Sunny Tripower 500"
      },

      realtime: {
        timestamp: "2026-02-25T11:10:00Z",
        status: "ON",
        power_kw: 420,
        energy_today_kwh: 3100,
        voltage_v: 690,
        current_a: 610,
        frequency_hz: 50,
        temperature_c: 47.2
      },

      today_performance: {
        total_generation_kwh: 3150,
        peak_generation_kw: 480,
        runtime_hours: 8.4,
        efficiency_pct: 97.6,
        performance_ratio: 84.3,
        forecast_deviation_pct: -3.2
      },

      reliability: {
        availability_pct: 99.1,
        mtbf_hours: 4200,
        fault_events_today: 0,
        last_maintenance_at: "2025-12-10"
      },

      financial_impact: {
        currency: "INR",
        revenue_today: 24150,
        export_credit_today: 4100,
        grid_savings_today: 7800
      },

      ai_scores: {
        energy_efficiency_score: 91.2,
        reliability_score: 93.5,
        anomaly_score: 12.4,
        grid_dependency_risk_score: 18.1,
        overall_intelligence_score: 89.4,
        ai_model_version: "INVERTER_AI_V3.2"
      },

      trend: generateInverterTrend(400),

      alerts: []
    },

    // ================================
    // ⚡ INV-B2 (Fault Example)
    // ================================
    {
      identity: {
        inverter_id: "inv_b2",
        name: "Inverter B2 - West Block",
        serial_number: "SN-B2-2024",
        commissioning_date: "2024-02-05"
      },

      specifications: {
        capacity_kw: 500,
        inverter_type: "STRING",
        manufacturer: "Huawei",
        model: "SUN2000-500K"
      },

      realtime: {
        timestamp: "2026-02-25T11:10:00Z",
        status: "FAULT",
        power_kw: 0,
        energy_today_kwh: 1200,
        voltage_v: 0,
        current_a: 0,
        frequency_hz: 0,
        temperature_c: 0
      },

      today_performance: {
        total_generation_kwh: 1200,
        peak_generation_kw: 300,
        runtime_hours: 3.1,
        efficiency_pct: 92.2,
        performance_ratio: 61.8,
        forecast_deviation_pct: -22.5
      },

      reliability: {
        availability_pct: 87.4,
        mtbf_hours: 2100,
        fault_events_today: 2,
        last_maintenance_at: "2025-11-15"
      },

      financial_impact: {
        currency: "INR",
        revenue_today: 8200,
        export_credit_today: 1900,
        grid_savings_today: 3000
      },

      ai_scores: {
        energy_efficiency_score: 72.4,
        reliability_score: 65.8,
        anomaly_score: 78.5,
        grid_dependency_risk_score: 44.2,
        overall_intelligence_score: 68.1,
        ai_model_version: "INVERTER_AI_V3.2"
      },

      trend: generateInverterTrend(350),

      alerts: [
        {
          severity: "HIGH",
          message: "Grid synchronization failure",
          triggered_at: "2026-02-25T09:15:00Z"
        }
      ]
    }
  ],

  meta: {
    calculation_engine_version: "INVERTER_ENGINE_V2.8",
    data_completeness_pct: 98.7,
    last_log_timestamp: "2026-02-25T11:10:00Z"
  }
};


// 🔥 Enterprise Trend Generator
function generateInverterTrend(basePower) {
  return {
    range: "24H",
    interval: "1H",
    data_points: 24,
    power_kw: Array.from({ length: 24 }, (_, i) =>
      Math.max(0, basePower + Math.sin(i / 2) * 120)
    ),
    voltage_v: Array.from({ length: 24 }, () => 690),
    temperature_c: Array.from({ length: 24 }, (_, i) =>
      35 + Math.sin(i / 4) * 5
    )
  };
}