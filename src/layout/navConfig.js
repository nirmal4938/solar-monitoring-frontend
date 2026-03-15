// // src/layout/navConfig.js

// export const navConfig = [

//   // =============================
//   // Dashboard
//   // =============================
//   {
//     label: "Dashboard",
//     icon: "pi pi-home",
//     children: [
//       { label: "Executive Overview", path: "/dashboard" },
//       { label: "Energy Intelligence Score", path: "/dashboard/intelligence" },
//       { label: "Carbon Snapshot", path: "/dashboard/carbon" }
//     ]
//   },

//   // =============================
//   // Energy Operations
//   // =============================
//   {
//     label: "Energy Operations",
//     icon: "pi pi-bolt",
//     children: [
//       { label: "Generation", path: "/generation" },
//       { label: "Consumption", path: "/consumption" },
//       { label: "Grid Interaction", path: "/grid" },
//       { label: "Operational Center", path: "/operational" },
//       { label: "Weather Intelligence", path: "/weather" }
//     ]
//   },

//   // =============================
//   // Infrastructure
//   // =============================
// {
//   label: "Infrastructure",
//   icon: "pi pi-server",
//   children: [
//     { label: "Plants", path: "/plants" },
//     { label: "Plant Configuration", path: "/plants/config" },
//     { label: "Inverters", path: "/inverters" },
//     { label: "Batteries", path: "/batteries" },
//     { label: "Maintenance Logs", path: "/maintenance" }
//   ]
// },

//   // =============================
//   // AI Intelligence
//   // =============================
//   {
//     label: "AI Intelligence",
//     icon: "pi pi-chart-line",
//     children: [
//       { label: "Generation Forecast", path: "/ai/forecast" },
//       { label: "Forecast Deviation", path: "/ai/forecast/deviation" },
//       { label: "Performance Scores", path: "/ai/performance" },
//       { label: "Battery Intelligence", path: "/battery/intelligence" },
//       { label: "Grid Dependency Risk", path: "/ai/grid-risk" }
//     ]
//   },

//   // =============================
//   // Carbon Intelligence
//   // =============================
//   {
//     label: "Carbon Intelligence",
//     icon: "pi pi-globe",
//     children: [
//       { label: "Carbon Dashboard", path: "/carbon/dashboard" },
//       { label: "Carbon Impact Ledger", path: "/carbon/ledger" },
//       { label: "Emissions Tracking", path: "/carbon/emissions" },
//       { label: "Carbon Intensity", path: "/carbon/intensity" },
//       { label: "Environmental Equivalents", path: "/carbon/equivalents" }
//     ]
//   },

//   // =============================
//   // Carbon Markets
//   // =============================
//   {
//     label: "Carbon Markets",
//     icon: "pi pi-money-bill",
//     children: [
//       { label: "Carbon Credit Prices", path: "/carbon/market-prices" },
//       { label: "Carbon Revenue", path: "/carbon/revenue" },
//       { label: "Credit Forecast", path: "/carbon/forecast" }
//     ]
//   },

//   // =============================
//   // ESG Reporting
//   // =============================
//   {
//     label: "ESG Reporting",
//     icon: "pi pi-file",
//     children: [
//       { label: "ESG Overview", path: "/esg/overview" },
//       { label: "ESG Reports", path: "/esg/reports" },
//       { label: "GRI Reports", path: "/esg/gri" },
//       { label: "BRSR Reports", path: "/esg/brsr" },
//       { label: "TCFD Reports", path: "/esg/tcfd" },
//       { label: "Audit Trail", path: "/esg/audit" }
//     ]
//   },

//   // =============================
//   // Financial Intelligence
//   // =============================
//   {
//     label: "Financial Intelligence",
//     icon: "pi pi-wallet",
//     children: [
//       { label: "Billing Summary", path: "/finance/billing" },
//       { label: "Tariff Configuration", path: "/finance/tariffs" },
//       { label: "Battery Savings", path: "/finance/battery-savings" },
//       { label: "Demand Charge Reduction", path: "/finance/demand-charges" }
//     ]
//   },

//   // =============================
//   // Alert Management
//   // =============================
//   {
//     label: "Alerts & Risk",
//     icon: "pi pi-bell",
//     children: [
//       { label: "Alert Console", path: "/alerts/console" },
//       { label: "Alert Rules", path: "/alerts/rules" },
//       { label: "Alert History", path: "/alerts/history" }
//     ]
//   },

//   // =============================
//   // Administration
//   // =============================
//   {
//     label: "Administration",
//     icon: "pi pi-cog",
//     children: [
//       { label: "Organizations", path: "/admin/organizations" },
//       { label: "Users", path: "/users" },
//       { label: "Roles & Permissions", path: "/roles" },
//       { label: "Plant Access Control", path: "/admin/plant-access" },
//       { label: "Audit Logs", path: "/admin/audit-logs" }
//     ]
//   },

//   // =============================
//   // System Configuration
//   // =============================
//   {
//     label: "System Configuration",
//     icon: "pi pi-sliders-h",
//     children: [
//       { label: "Carbon Factors", path: "/config/carbon-factors" },
//       { label: "Carbon Markets", path: "/config/carbon-markets" },
//       { label: "Environmental Factors", path: "/config/environment-factors" },
//       { label: "AI Models", path: "/config/ai-models" },
//       { label: "System Settings", path: "/settings" }
//     ]
//   }

// ];

// src/layout/navConfig.js

export const navConfig = [
  // =============================
  // Dashboard
  // =============================
  {
    label: "Dashboard",
    icon: "pi pi-home",
    children: [{ label: "Overview", path: "/dashboard" }],
  },

  // =============================
  // Energy
  // =============================
  {
    label: "Energy",
    icon: "pi pi-bolt",
    children: [
      { label: "Generation", path: "/generation" },
      { label: "Consumption", path: "/consumption" },
      { label: "Grid", path: "/grid" },
    ],
  },

  // =============================
  // Infrastructure
  // =============================
  {
    label: "Infrastructure",
    icon: "pi pi-server",
    children: [
      { label: "Plants", path: "/plants" },
      { label: "Inverters", path: "/inverters" },
      { label: "Batteries", path: "/batteries" },
      { label: "Plant Configuration", path: "/plants/config" },
    ],
  },

  // =============================
  // Financials
  // =============================
  {
    label: "Financials",
    icon: "pi pi-wallet",
    children: [
      { label: "Tariffs", path: "/finance/tariffs" },
      { label: "Billing Summary", path: "/finance/billing" },
    ],
  },

  // =============================
  // Alerts
  // =============================
  {
    label: "Alerts",
    icon: "pi pi-bell",
    children: [{ label: "Alert Console", path: "/alerts/console" }],
  },

  // =============================
  // Administration
  // =============================
  {
    label: "Administration",
    icon: "pi pi-cog",
    children: [
      { label: "Users", path: "/users" },
      { label: "Roles & Permissions", path: "/roles" },
    ],
  },
];
