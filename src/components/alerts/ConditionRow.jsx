// /components/alerts/ConditionRow.jsx

import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export default function ConditionRow({
  condition = {},
  onChange,
  onRemove
}) {
  const fields = [
    { label: "Generation Power (kW)", value: "generation_logs.power_kw" },
    { label: "Irradiance (W/m²)", value: "weather_logs.irradiance_wm2" },
    { label: "Battery SOC (%)", value: "battery_logs.soc_percent" },
    { label: "Anomaly Score", value: "ai_kpi_scores.anomaly_score" },
  ];

  const operators = [
    { label: "<", value: "<" },
    { label: ">", value: ">" },
    { label: "<=", value: "<=" },
    { label: ">=", value: ">=" },
    { label: "=", value: "=" },
  ];

  return (
    <div className="grid align-items-center mb-2">
      <div className="col-4">
        <Dropdown
          options={fields}
          value={condition.field}
          placeholder="Select Field"
          className="w-full"
          onChange={(e) =>
            onChange({ ...condition, field: e.value })
          }
        />
      </div>

      <div className="col-2">
        <Dropdown
          options={operators}
          value={condition.operator}
          placeholder="Op"
          className="w-full"
          onChange={(e) =>
            onChange({ ...condition, operator: e.value })
          }
        />
      </div>

      <div className="col-4">
        <InputText
          value={condition.value || ""}
          placeholder="Value"
          className="w-full"
          onChange={(e) =>
            onChange({ ...condition, value: e.target.value })
          }
        />
      </div>

      <div className="col-2 text-right">
        <Button
          icon="pi pi-trash"
          className="p-button-text p-button-danger"
          onClick={onRemove}
          type="button"
        />
      </div>
    </div>
  );
}