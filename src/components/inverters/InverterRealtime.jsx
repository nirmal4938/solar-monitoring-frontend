import "./InverterRealtime.css";

export function InverterRealtime({ data }) {
  return (
    <div className="inv-card">
      <h2 className="section-title">Realtime Operations</h2>

      <div className="inv-table">
        {data.inverters.map((inv) => (
          <div key={inv.identity.inverter_id} className="inv-row">
            <div>
              <div className="inv-name">{inv.identity.name}</div>
              <div className="inv-model">{inv.specifications.model}</div>
            </div>

            <div className={`status ${inv.realtime.status}`}>
              {inv.realtime.status}
            </div>

            <Metric label="Power" value={`${inv.realtime.power_kw} kW`} />
            <Metric label="Voltage" value={`${inv.realtime.voltage_v} V`} />
            <Metric label="Temp" value={`${inv.realtime.temperature_c} °C`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  );
}