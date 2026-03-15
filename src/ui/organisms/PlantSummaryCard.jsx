import { Card } from "primereact/card";
import StatusTag from "../atoms/StatusTag";

export default function PlantSummaryCard({ plant }) {
  return (
    <Card className="border-round-xl shadow-2">
      <div className="flex justify-content-between">
        <div>
          <h3 className="m-0">{plant.name}</h3>
          <p className="text-500">{plant.location}</p>
          <div className="mt-2">
            Capacity: {plant.capacity_kw} kW
          </div>
        </div>
        <StatusTag value={plant.plant_type} />
      </div>
    </Card>
  );
}