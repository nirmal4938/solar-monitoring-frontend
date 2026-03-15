import { useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

import { InfrastructureDesigner } from "../../components/plant/plant-designer/InfrastructureDesigner";
import { useEditPlant } from "../../hooks/useEditPlant";

export const PlantDesignerPage = () => {
  const { id } = useParams();
  console.log("id", id)
  const {
    plant,
    configuration,
    loading,
    saveOrUpdateConfiguration,
  } = useEditPlant(id);

//   if (loading || !plant) return <div>Loading...</div>;
  console.log('configuration',configuration)
  const solarCapacity = plant?.capacity_kw;
  const inverterCapacity =
    configuration?.inverters?.reduce((sum, i) => sum + i.capacity_kw, 0) || 0;
  const batteryCapacity =
    configuration?.batteries?.reduce((sum, b) => sum + b.capacity_kwh, 0) || 0;

  const capacityBalanced = solarCapacity === inverterCapacity;

  return (
    <div className="p-4">
      {/* Plant Overview */}
      <Card className="mb-4 shadow-3">
        <div className="flex justify-content-between align-items-center">
          <div>
            <h1 className="m-0 text-3xl">{plant?.name}</h1>
            <small className="text-600">
              {plant?.location} • {plant?.plant_type}
            </small>
          </div>

          <div className="flex gap-2">
            <Tag value={`${plant?.capacity_kw} kW`} severity="info" />
            <Tag
              value={plant?.grid_connected ? "Grid Connected" : "Off Grid"}
              severity={plant?.grid_connected ? "success" : "warning"}
            />
          </div>
        </div>
      </Card>

      {/* Engineering KPIs */}
      <div className="grid mb-4 gap-0">
        <div className="col-3">
          <Card className="text-center shadow-2">
            <h2 className="m-0">{solarCapacity} kW</h2>
            <small className="text-600">Solar Capacity</small>
          </Card>
        </div>
        <div className="col-3">
          <Card className="text-center shadow-2">
            <h2 className="m-0">{inverterCapacity} kW</h2>
            <small className="text-600">Inverter Capacity</small>
          </Card>
        </div>
        <div className="col-3">
          <Card className="text-center shadow-2">
            <h2 className="m-0">{batteryCapacity} kWh</h2>
            <small className="text-600">Battery Storage</small>
          </Card>
        </div>
        <div className="col-3">
          <Card className="text-center shadow-2">
            <Tag
              value={capacityBalanced ? "Balanced System" : "Capacity Mismatch"}
              severity={capacityBalanced ? "success" : "warning"}
            />
            <small className="text-600 block mt-2">System Status</small>
          </Card>
        </div>
      </div>

      {/* Infrastructure Designer */}
      <InfrastructureDesigner
        plantId={id}
        infraConfig={configuration}
        onSave={saveOrUpdateConfiguration}
      />

      {/* Energy Architecture */}
      <Card className="mb-4 shadow-3" title="Energy Architecture">
        <div className="flex justify-content-center align-items-center gap-6 text-center">
          <div>
            <i className="pi pi-sun text-4xl text-yellow-500"></i>
            <div className="mt-2 font-semibold">Solar</div>
          </div>
          <i className="pi pi-arrow-right text-2xl"></i>
          <div>
            <i className="pi pi-bolt text-4xl text-blue-500"></i>
            <div className="mt-2 font-semibold">Inverters</div>
          </div>
          <i className="pi pi-arrow-right text-2xl"></i>
          <div>
            <i className="pi pi-database text-4xl text-orange-500"></i>
            <div className="mt-2 font-semibold">Battery</div>
          </div>
          <i className="pi pi-arrow-right text-2xl"></i>
          <div>
            <i className="pi pi-building text-4xl text-green-500"></i>
            <div className="mt-2 font-semibold">Grid / Load</div>
          </div>
        </div>
      </Card>

      {/* System Validation */}
      <Card title="System Validation" className="shadow-3">
        <Tag
          severity={capacityBalanced ? "success" : "warning"}
          value={
            capacityBalanced
              ? "System configuration looks balanced and ready for deployment"
              : "Solar capacity should match inverter capacity for optimal efficiency"
          }
        />
      </Card>
    </div>
  );
};