import { Tag } from "primereact/tag";

export default function SubscriptionTag({ plan, status }) {
  const severity =
    status === "ACTIVE"
      ? "success"
      : status === "TRIAL"
      ? "info"
      : "danger";

  return (
    <div className="flex gap-2 align-items-center">
      <Tag value={plan} severity="contrast" />
      <Tag value={status} severity={severity} />
    </div>
  );
}