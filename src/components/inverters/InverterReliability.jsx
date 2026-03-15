import "./InverterReliability.css";

export function InverterReliability({ data }) {
  return (
    <div className="inv-card">
      <h2 className="section-title">Reliability Engineering</h2>

      {data.inverters.map((inv) => (
        <div key={inv.identity.inverter_id} className="rel-row">
          <div>{inv.identity.name}</div>
          <div>Availability {inv.reliability.availability_pct}%</div>
          <div>MTBF {inv.reliability.mtbf_hours} hrs</div>
          <div>Faults Today {inv.reliability.fault_events_today}</div>
        </div>
      ))}
    </div>
  );
}