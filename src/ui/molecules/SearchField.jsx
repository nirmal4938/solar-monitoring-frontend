import { InputText } from "primereact/inputtext";

export default function SearchField({ value, onChange, placeholder }) {
  return (
    <span className="p-input-icon-left w-full">
      <i className="pi pi-search" />
      <InputText
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="w-full"
      />
    </span>
  );
}