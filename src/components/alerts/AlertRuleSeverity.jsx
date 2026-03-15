// /components/alerts/AlertRuleSeverity.jsx
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";

export default function AlertRuleSeverity({ rule, onChange }) {
  return (
    <div className="severity-section p-3 surface-card border-round shadow-1">
      <div className="font-bold mb-2 text-gray-900">Severity & Priority</div>

      <div className="flex flex-column gap-3">
        <Dropdown
          value={rule.severity}
          options={["LOW","MEDIUM","HIGH"]}
          placeholder="Severity Level"
          onChange={(e) => onChange("severity", e.value)}
        />
        <small className="text-gray-500">Impact of this alert</small>

        <InputNumber
          value={rule.priority}
          placeholder="Priority (1-10)"
          min={1}
          max={10}
          onChange={(e) => onChange("priority", e.value)}
        />
        <small className="text-gray-500">Higher priority triggers first</small>
      </div>
    </div>
  );
}