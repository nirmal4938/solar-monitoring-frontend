import { Card } from "primereact/card";

export default function KpiCard({ title, value, unit, icon }) {
  return (
    <Card className="shadow-2 border-round-xl">
      <div className="flex justify-content-between align-items-center">
        <div>
          <div className="text-500 text-sm">{title}</div>
          <div className="text-3xl font-bold mt-2">
            {value} {unit}
          </div>
        </div>
        {icon && <i className={`${icon} text-4xl text-primary`} />}
      </div>
    </Card>
  );
}