// =====================================================
// 🌍 ENERGY INTELLIGENCE PLATFORM - ENTERPRISE V3
// Multi-Plant | Map Ready | Portfolio Aggregation
// =====================================================

export const plantIntelligenceMock = {
  api_version: "v3",
  generated_at: "2026-02-25T12:00:00Z",
  timezone: "Asia/Kolkata",

  // =====================================================
  // 🏢 ORGANIZATION CONTEXT
  // =====================================================
  organization: {
    organization_id: "org_uuid",
    organization_name: "KayJay Energy Pvt Ltd",
    portfolio_capacity_kw: 6200,
    total_plants: 3,
    headquarters: "India",
    subscription_tier: "ENTERPRISE_PLUS"
  },

  // =====================================================
  // 🔐 GLOBAL PERMISSIONS
  // =====================================================
  permissions: {
    can_view_financials: true,
    can_view_ai_scores: true,
    can_view_carbon: true,
    can_export_reports: true,
    can_schedule_maintenance: true,
    can_view_portfolio_map: true,
    can_compare_plants: true
  },

  // =====================================================
  // 📊 PORTFOLIO AGGREGATED SUMMARY
  // (Executive-Level Intelligence)
  // =====================================================
  portfolio_summary: {
    today_generation_kwh: 35840,
    today_consumption_kwh: 30120,
    net_energy_balance_kwh: 5720,

    avg_performance_ratio: 84.9,
    avg_availability_pct: 97.8,

    grid_dependency_pct: 21.4,
    self_consumption_pct: 71.6,

    total_active_alerts: 6,
    open_maintenance_items: 2,

    portfolio_intelligence_score: 88.2
  },

  // =====================================================
  // 🏭 PLANTS ARRAY (Multi-Plant Ready)
  // Each plant is modular & self-contained
  // =====================================================
  plants: [
    buildPlant({
      id: "plant_alpha",
      name: "Plant Alpha",
      type: "INDUSTRIAL",
      state: "Gujarat",
      lat: 23.0225,
      lng: 72.5714,
      capacity: 2000,
      basePower: 1200,
      intelligenceScore: 87.5
    }),

    buildPlant({
      id: "plant_beta",
      name: "Plant Beta",
      type: "COMMERCIAL",
      state: "Rajasthan",
      lat: 26.9124,
      lng: 75.7873,
      capacity: 2500,
      basePower: 1500,
      intelligenceScore: 90.1
    }),

    buildPlant({
      id: "plant_gamma",
      name: "Plant Gamma",
      type: "UTILITY",
      state: "Maharashtra",
      lat: 19.076,
      lng: 72.8777,
      capacity: 1700,
      basePower: 1000,
      intelligenceScore: 86.3
    })
  ],

  // =====================================================
  // 📈 GLOBAL META
  // =====================================================
  meta: {
    calculation_engine_version: "PLANT_ENGINE_V6.0",
    ai_engine_version: "PORTFOLIO_AI_V2.1",
    carbon_engine_version: "CARBON_ENGINE_V3.0",
    data_completeness_pct: 99.4,
    last_log_timestamp: "2026-02-25T11:58:00Z"
  }
};


// =====================================================
// 🏭 Plant Builder (Modular Microservice Friendly)
// =====================================================
function buildPlant({
  id,
  name,
  type,
  state,
  lat,
  lng,
  capacity,
  basePower,
  intelligenceScore
}) {
  return {
    identity: {
      plant_id: id,
      plant_name: name,
      plant_type: type,
      location: `${state}, India`,
      latitude: lat,
      longitude: lng,
      capacity_kw: capacity,
      commissioning_date: "2024-01-01",
      status: "ACTIVE"
    },

    // =====================================================
    // 📊 EXECUTIVE SUMMARY
    // =====================================================
    summary: {
      today_generation_kwh: Math.round(basePower * 10.3),
      today_consumption_kwh: Math.round(basePower * 8.9),
      net_energy_balance_kwh: 1630,
      plant_performance_ratio: 83.2,
      availability_pct: 98.6,
      active_alerts: Math.floor(Math.random() * 3),
      open_maintenance_items: 1,
      overall_intelligence_score: intelligenceScore
    },

    // =====================================================
    // ⚡ ENERGY FLOW
    // =====================================================
    energy_flow: {
      solar_generation_kwh: Math.round(basePower * 10.3),
      total_import_kwh: 2100,
      total_export_kwh: 1450,
      total_consumption_kwh: 10820,

      battery_charge_kwh: 1800,
      battery_discharge_kwh: 1600,
      battery_round_trip_loss_kwh: 120,

      solar_to_battery_kwh: 1400,
      battery_to_load_kwh: 1100,
      battery_to_grid_kwh: 500
    },

    // =====================================================
    // 💰 FINANCIAL INTELLIGENCE
    // =====================================================
    financial_impact: {
      currency: "INR",
      revenue_today: 94200,
      export_credit_today: 11200,
      grid_import_cost_today: 15800,
      battery_arbitrage_savings: 6400,
      demand_charge_savings: 3100,
      adjusted_net_savings_today: 86800,
      projected_monthly_savings: 2560000
    },

    // =====================================================
    // 🤖 AI INTELLIGENCE
    // =====================================================
    ai_scores: {
      energy_efficiency_score: 90.4,
      reliability_score: 92.1,
      anomaly_score: 14.8,
      battery_health_score: 93.4,
      overall_intelligence_score: intelligenceScore,
      ai_model_version: "PLANT_AI_V5.0"
    },

    // =====================================================
    // 🌦 FORECAST
    // =====================================================
    forecast: {
      expected_generation_kwh: 12800,
      actual_generation_kwh: 12450,
      deviation_pct: -2.7,
      deviation_category: "NORMAL",
      confidence_pct: 94.2
    },

    // =====================================================
    // 🌱 CARBON IMPACT
    // =====================================================
    carbon_impact: {
      avoided_emissions_tonnes: 8.814,
      trees_equivalent: 403,
      carbon_intensity_kg_per_kwh: 0.142
    },

    // =====================================================
    // 🚨 ALERT SUMMARY
    // =====================================================
    alerts_summary: {
      total_active: 3,
      high: 1,
      medium: 1,
      low: 1
    },

    // =====================================================
    // 🛠 MAINTENANCE SUMMARY
    // =====================================================
    maintenance_summary: {
      open_items: 1,
      total_cost_this_month: 42000,
      predicted_next_service_date: "2026-05-15"
    },

    // =====================================================
    // 📈 TREND DATA
    // =====================================================
    trend: generatePlantTrend(basePower)
  };
}


// =====================================================
// 📊 Enterprise Trend Generator
// =====================================================
function generatePlantTrend(basePower) {
  return {
    range: "24H",
    interval: "1H",
    data_points: 24,

    generation_kw: Array.from({ length: 24 }, (_, i) =>
      Math.max(0, basePower + Math.sin(i / 2) * 300)
    ),

    consumption_kw: Array.from({ length: 24 }, (_, i) =>
      Math.max(0, basePower * 0.8 + Math.cos(i / 2) * 250)
    ),

    grid_import_kw: Array.from({ length: 24 }, (_, i) =>
      Math.max(0, 200 + Math.sin(i / 3) * 100)
    ),

    battery_discharge_kw: Array.from({ length: 24 }, (_, i) =>
      Math.max(0, 300 + Math.cos(i / 4) * 150)
    )
  };
}