import React from "react";

export default function BatteryFilters({ plantFilter, setPlantFilter, statusFilter, setStatusFilter }) {
  return (
    <>
      <div className="bb-filter-bar">
        {/* Plant and Status filters can be dropdowns */}
        {/* Implement PrimeReact Dropdowns here */}
      </div>

      <style>{`
        .bb-filter-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          padding: 6px 8px;
          border: 1.5px solid #cbd5e1;
          background: #f8fafc;
          min-height: 34px;
        }
      `}</style>
    </>
  );
}