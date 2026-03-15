import KpiCard from "./KpiCard";

export default function MoneyKpiCard({ title, value, currency = "₹" }) {
  return (
    <KpiCard
      title={title}
      value={`${currency} ${Number(value).toLocaleString()}`}
      icon="pi pi-wallet"
    />
  );
}