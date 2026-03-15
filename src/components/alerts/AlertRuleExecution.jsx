// /components/alerts/AlertRuleExecution.jsx
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";

export default function AlertRuleExecution({ rule, onChange }) {
  return (
    <div className="execution-section p-3 surface-card border-round shadow-1">
      <div className="font-bold mb-2 text-gray-900">Evaluation & Execution</div>

      <div className="flex flex-column gap-3">

        <MultiSelect
          value={rule.notification_channels || []}
          options={["DASHBOARD","EMAIL","SMS","WHATSAPP","WEBHOOK"]}
          placeholder="Notification Channels"
          onChange={(e) => onChange("notification_channels", e.value)}
          display="chip"
        />
        <small className="text-gray-500">Where this alert should be delivered</small>

        <Dropdown
          value={rule.evaluation_frequency}
          options={["REALTIME","HOURLY","DAILY","MONTHLY"]}
          placeholder="Evaluation Frequency"
          onChange={(e) => onChange("evaluation_frequency", e.value)}
        />
        <small className="text-gray-500">How often this alert is evaluated</small>

        <InputNumber
          value={rule.cooldown_minutes}
          placeholder="Cooldown (minutes)"
          min={0}
          onChange={(e) => onChange("cooldown_minutes", e.value)}
        />
        <small className="text-gray-500">Minimum gap before alert triggers again</small>

        <div className="flex align-items-center gap-2">
          <Checkbox
            inputId="autoResolve"
            checked={rule.auto_resolve}
            onChange={(e) => onChange("auto_resolve", e.checked)}
          />
          <label htmlFor="autoResolve">Auto Resolve</label>
        </div>
      </div>
    </div>
  );
}