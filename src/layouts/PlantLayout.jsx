import AppShellLayout from "./AppShellLayout";

export default function PlantLayout({ children, plantName }) {
  return (
    <AppShellLayout>
      <div className="mb-4">
        <h2 className="m-0">{plantName}</h2>
      </div>
      {children}
    </AppShellLayout>
  );
}