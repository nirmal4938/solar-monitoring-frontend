import { Tag } from "primereact/tag";

const severityMap = {
  ACTIVE: "success",
  RESOLVED: "info",
  HIGH: "danger",
  MEDIUM: "warning",
  LOW: "info",
  ON: "success",
  OFF: "secondary",
  FAULT: "danger",
  CHARGING: "info",
  DISCHARGING: "warning",
  IDLE: "secondary",
  DRAFT: "warning",
  FINALIZED: "success",
  AUDITED: "info",
};

export default function StatusTag({ value }) {
  return (
    <Tag
      value={value}
      severity={severityMap[value] || "secondary"}
      className="text-sm font-medium"
    />
  );
}