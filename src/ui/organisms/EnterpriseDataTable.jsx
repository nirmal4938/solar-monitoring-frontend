import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function EnterpriseDataTable({
  value,
  columns,
  paginator = true,
  rows = 10,
  loading = false,
}) {
  return (
    <DataTable
      value={value}
      paginator={paginator}
      rows={rows}
      loading={loading}
      stripedRows
      showGridlines
      className="p-datatable-sm"
      responsiveLayout="scroll"
    >
      {columns.map((col) => (
        <Column key={col.field} {...col} />
      ))}
    </DataTable>
  );
}