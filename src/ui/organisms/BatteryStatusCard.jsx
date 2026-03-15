import { Card } from "primereact/card";
import StatusTag from "../atoms/StatusTag";

export default function BatteryStatusCard({ battery }) {
  return (
    <Card className="shadow-2 border-round-xl">
      <div className="flex justify-content-between">
        <div>
          <h4>{battery.name}</h4>
          <div>SOC: {battery.soc_percent}%</div>
          <div>Health: {battery.health_pct}%</div>
        </div>
        <StatusTag value={battery.status} />
      </div>
    </Card>
  );
}