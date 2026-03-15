import { Menubar } from "primereact/menubar";

export default function AppShellLayout({ children }) {
  const items = [
    { label: "Dashboard", icon: "pi pi-home" },
    { label: "Plants", icon: "pi pi-building" },
    { label: "Carbon", icon: "pi pi-globe" },
    { label: "Billing", icon: "pi pi-wallet" },
  ];

  return (
    <div className="min-h-screen surface-ground">
      <Menubar model={items} />
      <div className="p-4">{children}</div>
    </div>
  );
}