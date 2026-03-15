import AppShellLayout from "./AppShellLayout";

export default function OrganizationLayout({ children }) {
  return (
    <AppShellLayout>
      <div className="mb-4 text-xl font-semibold">
        Organization Workspace
      </div>
      {children}
    </AppShellLayout>
  );
}