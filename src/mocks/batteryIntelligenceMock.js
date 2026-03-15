export const batteryIntelligenceMock = {
  api_version: "v1",
  generated_at: "2026-02-25T10:30:05Z",

  tenant: {
    organization_id: "org_uuid",
    plant_id: "plant_uuid",
    plant_name: "Plant Alpha",
    plant_type: "INDUSTRIAL"
  },

  permissions: {
    can_view_financials: true,
    can_view_ai_scores: true,
    can_control_battery: true
  },

  summary: {
    battery_count: 3,
    active_alerts: 4,
    overall_battery_health_avg: 94.8,
    total_capacity_kwh: 1500
  },

  batteries: [
    // ================================
    // 🔋 Battery A1 – Peak Shaving
    // ================================
    {
      identity: {
        battery_id: "bat_a1",
        name: "Battery A1 - Main Bank",
        commissioning_date: "2024-01-15"
      },

      specifications: {
        capacity_kwh: 500,
        usable_capacity_kwh: 450,
        max_charge_kw: 250,
        max_discharge_kw: 250,
        round_trip_efficiency_pct: 92.5,
        depth_of_discharge_pct: 85
      },

      realtime: {
        timestamp: "2026-02-25T10:30:00Z",
        soc_percent: 68.4,
        health_pct: 96.2,
        status: "DISCHARGING",
        charge_kw: 0,
        discharge_kw: 120,
        battery_temperature_c: 34.5,
        cycle_count: 210
      },

      today_performance: {
        battery_charge_kwh: 420,
        battery_discharge_kwh: 398,
        battery_round_trip_loss_kwh: 22,
        battery_utilization_pct: 76.5,
        peak_battery_discharge_kw: 180,
        solar_to_battery_kwh: 350,
        battery_to_load_kwh: 320,
        battery_to_grid_kwh: 78,
        demand_charge_reduction_kw: 95
      },

      financial_impact: {
        currency: "INR",
        battery_arbitrage_savings: 15420.5,
        demand_charge_savings: 9200,
        battery_degradation_cost: 2400,
        adjusted_net_bill_amount: 185000
      },

      ai_scores: {
        battery_efficiency_score: 88.4,
        arbitrage_optimization_score: 74.2,
        peak_shaving_score: 91.0,
        battery_health_score: 93.5,
        ai_model_version: "BATTERY_AI_V2.1"
      },

      trend: generateTrend(70),

      alerts: [
        {
          severity: "HIGH",
          message: "Battery temperature exceeded threshold",
          triggered_at: "2026-02-25T09:00:00Z"
        }
      ]
    },

    // ================================
    // 🔋 Battery B2 – Solar Buffer Bank
    // ================================
    {
      identity: {
        battery_id: "bat_b2",
        name: "Battery B2 - Solar Buffer",
        commissioning_date: "2024-03-10"
      },

      specifications: {
        capacity_kwh: 500,
        usable_capacity_kwh: 460,
        max_charge_kw: 300,
        max_discharge_kw: 200,
        round_trip_efficiency_pct: 93.1,
        depth_of_discharge_pct: 80
      },

      realtime: {
        timestamp: "2026-02-25T10:30:00Z",
        soc_percent: 82.1,
        health_pct: 95.4,
        status: "CHARGING",
        charge_kw: 180,
        discharge_kw: 0,
        battery_temperature_c: 32.1,
        cycle_count: 178
      },

      today_performance: {
        battery_charge_kwh: 510,
        battery_discharge_kwh: 430,
        battery_round_trip_loss_kwh: 30,
        battery_utilization_pct: 82.4,
        peak_battery_discharge_kw: 160,
        solar_to_battery_kwh: 470,
        battery_to_load_kwh: 360,
        battery_to_grid_kwh: 70,
        demand_charge_reduction_kw: 88
      },

      financial_impact: {
        currency: "INR",
        battery_arbitrage_savings: 18250,
        demand_charge_savings: 10100,
        battery_degradation_cost: 2100,
        adjusted_net_bill_amount: 179500
      },

      ai_scores: {
        battery_efficiency_score: 90.2,
        arbitrage_optimization_score: 82.5,
        peak_shaving_score: 87.3,
        battery_health_score: 94.1,
        ai_model_version: "BATTERY_AI_V2.1"
      },

      trend: generateTrend(80),

      alerts: [
        {
          severity: "MEDIUM",
          message: "Cycle count nearing service threshold",
          triggered_at: "2026-02-24T16:20:00Z"
        }
      ]
    },

    // ================================
    // 🔋 Battery C3 – Backup Reserve
    // ================================
    {
      identity: {
        battery_id: "bat_c3",
        name: "Battery C3 - Reserve",
        commissioning_date: "2023-11-05"
      },

      specifications: {
        capacity_kwh: 500,
        usable_capacity_kwh: 440,
        max_charge_kw: 200,
        max_discharge_kw: 200,
        round_trip_efficiency_pct: 90.8,
        depth_of_discharge_pct: 75
      },

      realtime: {
        timestamp: "2026-02-25T10:30:00Z",
        soc_percent: 54.2,
        health_pct: 92.7,
        status: "IDLE",
        charge_kw: 0,
        discharge_kw: 0,
        battery_temperature_c: 30.8,
        cycle_count: 312
      },

      today_performance: {
        battery_charge_kwh: 250,
        battery_discharge_kwh: 240,
        battery_round_trip_loss_kwh: 15,
        battery_utilization_pct: 48.3,
        peak_battery_discharge_kw: 120,
        solar_to_battery_kwh: 200,
        battery_to_load_kwh: 210,
        battery_to_grid_kwh: 30,
        demand_charge_reduction_kw: 60
      },

      financial_impact: {
        currency: "INR",
        battery_arbitrage_savings: 9200,
        demand_charge_savings: 5400,
        battery_degradation_cost: 3100,
        adjusted_net_bill_amount: 192000
      },

      ai_scores: {
        battery_efficiency_score: 82.7,
        arbitrage_optimization_score: 68.9,
        peak_shaving_score: 74.4,
        battery_health_score: 88.2,
        ai_model_version: "BATTERY_AI_V2.1"
      },

      trend: generateTrend(55),

      alerts: [
        {
          severity: "LOW",
          message: "Reserve battery idle for extended duration",
          triggered_at: "2026-02-25T06:00:00Z"
        }
      ]
    }
  ],

  meta: {
    calculation_engine_version: "BATTERY_ENGINE_V1.4",
    data_completeness_pct: 99.2,
    last_log_timestamp: "2026-02-25T10:30:00Z"
  }
};


// 🔥 helper to auto-generate trend curves
function generateTrend(baseSoc) {
  return {
    range: "24H",
    interval: "1H",
    data_points: 24,
    soc: Array.from({ length: 24 }, (_, i) => baseSoc + Math.sin(i / 3) * 10),
    charge_kw: Array.from({ length: 24 }, (_, i) =>
      i < 8 ? 150 - i * 15 : 0
    ),
    discharge_kw: Array.from({ length: 24 }, (_, i) =>
      i > 8 ? (i - 8) * 10 : 0
    )
  };
}