import { Card } from "primereact/card";

export default function AuditMetadataPanel({ audit }) {
  return (
    <Card className="border-round-xl shadow-1">
      <h5>Audit Metadata</h5>
      <div>Engine Version: {audit.calculation_engine_version}</div>
      <div>Hash: {audit.calculation_hash}</div>
      <div>Emission Factor: {audit.emission_factor_applied}</div>
      <div>Credit Price: {audit.credit_price_applied}</div>
    </Card>
  );
}