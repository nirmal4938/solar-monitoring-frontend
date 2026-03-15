export default function PermissionGuard({
  userPermissions = [],
  resource,
  action,
  children,
}) {
  const allowed = userPermissions?.some(
    (p) => p.resource === resource && p.action === action
  );

  if (!allowed) return null;

  return children;
}