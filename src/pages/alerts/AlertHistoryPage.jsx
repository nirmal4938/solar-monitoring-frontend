import { useMemo, useRef, useState } from "react";
import PageLayout from "../../layouts/PageLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useEditAlerts } from "../../hooks/useEditAlerts";
import "./AlertHistoryPage.css";

export const AlertHistoryPage = () => {

  const toast = useRef(null);
  const dt = useRef(null);

  const plantId = localStorage.getItem("selectedPlantId");

  const {
    historyAlerts,
    loading,
    acknowledge,
    resolve,
    fetchActive,
    fetchHistory
  } = useEditAlerts(plantId);

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  /* NORMALIZE DATA */

  const normalizedAlerts = useMemo(() => {
    return historyAlerts.map((a) => {

      const metadata = a.metadata || {};

      const triggeredValue =
        a.triggered_value ??
        metadata.power_kw ??
        metadata.load_kw ??
        metadata.soc_percent ??
        "-";

      const thresholdValue = a.threshold_value ?? "-";

      return {
        ...a,
        triggered_value: triggeredValue,
        threshold_value: thresholdValue
      };

    });
  }, [historyAlerts]);

  /* FILTER */

  const filteredAlerts = useMemo(() => {

    return normalizedAlerts.filter((a) => {

      const matchesSearch =
        a.message?.toLowerCase().includes(search.toLowerCase()) ||
        a.entity_type?.toLowerCase().includes(search.toLowerCase());

      const matchesSeverity =
        severityFilter ? a.severity === severityFilter : true;

      const matchesStatus =
        statusFilter ? a.status === statusFilter : true;

      return matchesSearch && matchesSeverity && matchesStatus;

    });

  }, [normalizedAlerts, search, severityFilter, statusFilter]);

  /* TEMPLATES */

  const severityTemplate = (row) => {

    const map = {
      LOW: "info",
      MEDIUM: "warning",
      HIGH: "danger",
      CRITICAL: "danger"
    };

    return <Tag value={row.severity} severity={map[row.severity]} />;
  };

  const statusTemplate = (row) => {

    const map = {
      ACTIVE: "danger",
      ACKNOWLEDGED: "warning",
      RESOLVED: "success",
      CLOSED: "info"
    };

    return <Tag value={row.status} severity={map[row.status]} />;
  };

  const formatNumber = (value) => {
    if (value === "-" || value === undefined || value === null) return "-";
    return Number(value).toLocaleString();
  };

  const dateTemplate = (row, field) =>
    row[field] ? new Date(row[field]).toLocaleString() : "-";

  const ageTemplate = (row) => {

    if (!row.triggered_at) return "-";

    const diff = Date.now() - new Date(row.triggered_at);
    const minutes = Math.floor(diff / 60000);

    if (minutes < 60) return `${minutes} min`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours} hr`;

    return `${Math.floor(hours / 24)} d`;
  };

  /* ACTIONS */

  const handleAcknowledge = async (id) => {

    try {

      await acknowledge(id);

      toast.current.show({
        severity: "success",
        summary: "Alert acknowledged",
        life: 2000
      });

      fetchActive();
      fetchHistory();

    } catch {

      toast.current.show({
        severity: "error",
        summary: "Failed to acknowledge"
      });

    }

  };

  const handleResolve = async (id) => {

    try {

      await resolve(id);

      toast.current.show({
        severity: "success",
        summary: "Alert resolved",
        life: 2000
      });

      fetchActive();
      fetchHistory();

    } catch {

      toast.current.show({
        severity: "error",
        summary: "Resolve failed"
      });

    }

  };

  const actionTemplate = (row) => {

    if (row.status !== "ACTIVE") return null;

    return (
      <div className="alert-actions">

        <Button
          icon="pi pi-check"
          className="p-button-text p-button-sm"
          tooltip="Acknowledge"
          onClick={() => handleAcknowledge(row.id)}
        />

        <Button
          icon="pi pi-times"
          className="p-button-text p-button-sm"
          tooltip="Resolve"
          onClick={() => handleResolve(row.id)}
        />

      </div>
    );
  };

  const activeCount = useMemo(
    () => normalizedAlerts.filter((a) => a.status === "ACTIVE").length,
    [normalizedAlerts]
  );

  const rowClassName = (row) =>
    `alert-row severity-${row.severity}`;

  return (

    <PageLayout title="" showBack={false}>

      <Toast ref={toast} />

      <div className="alert-topbar">

        <div className="alert-kpi">
          {activeCount} Active | {normalizedAlerts.length} Total Alerts
        </div>

        <div className="alert-actions-right">

          <Button
            label="Refresh"
            icon="pi pi-refresh"
            className="p-button-text p-button-sm"
            onClick={() => {
              fetchActive();
              fetchHistory();
            }}
          />

          <Button
            label="Export"
            icon="pi pi-download"
            className="p-button-text p-button-sm"
            onClick={() => dt.current.exportCSV()}
          />

        </div>

      </div>

      <div className="alert-filters">

        <InputText
          placeholder="Search alerts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Dropdown
          placeholder="Severity"
          value={severityFilter}
          options={[
            { label: "Low", value: "LOW" },
            { label: "Medium", value: "MEDIUM" },
            { label: "High", value: "HIGH" },
            { label: "Critical", value: "CRITICAL" }
          ]}
          onChange={(e) => setSeverityFilter(e.value)}
          showClear
        />

        <Dropdown
          placeholder="Status"
          value={statusFilter}
          options={[
            { label: "Active", value: "ACTIVE" },
            { label: "Acknowledged", value: "ACKNOWLEDGED" },
            { label: "Resolved", value: "RESOLVED" },
            { label: "Closed", value: "CLOSED" }
          ]}
          onChange={(e) => setStatusFilter(e.value)}
          showClear
        />

      </div>

      <div className="bb-table-wrapper">

        <DataTable
          ref={dt}
          value={filteredAlerts}
          paginator
          rows={10}
          rowsPerPageOptions={[10,20,50]}
          loading={loading}
          dataKey="id"
          scrollable
          scrollHeight="600px"
          resizableColumns
          columnResizeMode="fit"
          emptyMessage="No alerts found"
          rowClassName={rowClassName}
          className="bb-datatable"
          tableStyle={{ minWidth: "1500px" }}
        >

          <Column field="plant_name" header="Plant" style={{ width:"220px" }} />

          <Column
            field="severity"
            header="Severity"
            body={severityTemplate}
            style={{ width:"120px", textAlign:"center" }}
          />

          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            style={{ width:"120px", textAlign:"center" }}
          />

          <Column
            field="message"
            header="Alert Message"
            style={{ width:"380px" }}
          />

          <Column
            header="Value"
            body={(row)=>formatNumber(row.triggered_value)}
            style={{ width:"120px", textAlign:"right" }}
          />

          <Column
            header="Threshold"
            body={(row)=>formatNumber(row.threshold_value)}
            style={{ width:"120px", textAlign:"right" }}
          />

          <Column
            header="Age"
            body={ageTemplate}
            style={{ width:"100px", textAlign:"center" }}
          />

          <Column
            header="Triggered"
            body={(row)=>dateTemplate(row,"triggered_at")}
            style={{ width:"200px" }}
          />

          <Column
            header="Resolved"
            body={(row)=>dateTemplate(row,"resolved_at")}
            style={{ width:"200px" }}
          />

          <Column
            body={actionTemplate}
            header="Action"
            style={{ width:"100px", textAlign:"center" }}
          />

        </DataTable>

      </div>

    </PageLayout>
  );
};