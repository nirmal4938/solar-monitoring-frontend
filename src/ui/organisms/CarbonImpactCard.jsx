import { Card } from "primereact/card";

export default function CarbonImpactCard({ data }) {
  return (
    <Card className="shadow-2 border-round-xl">
      <h4>Carbon Impact</h4>
      <div className="grid mt-3">
        <div className="col-6">
          Avoided: {data.avoided_emissions_tonnes} tCO₂
        </div>
        <div className="col-6">
          Revenue: ₹ {data.carbon_credit_revenue}
        </div>
        <div className="col-6">
          Trees Equivalent: {data.trees_equivalent}
        </div>
        <div className="col-6">
          Diesel Offset: {data.diesel_offset_liters} L
        </div>
      </div>
    </Card>
  );
}