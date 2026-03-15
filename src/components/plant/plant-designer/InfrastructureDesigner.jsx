// InfrastructureDesigner.jsx
import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";

export const InfrastructureDesigner = ({ plantId, infraConfig, onSave }) => {

  const [infraData, setInfraData] = useState({});
  const [selectedInfra, setSelectedInfra] = useState({});

  /* --------------------------------------------------
     Initialize infrastructure
  -------------------------------------------------- */

  useEffect(() => {

    if (!infraConfig) return;

    const types = ["inverters", "batteries", "weather_sensors", "grid_meters"];

    const data = {};
    const selected = {};

    types.forEach((type) => {

      const items = infraConfig[type] || [];

      data[type] = items;

      // preselect existing infra
      selected[type] = [...items];

    });

    setInfraData(data);
    setSelectedInfra(selected);

  }, [infraConfig]);

  /* --------------------------------------------------
     Handle selection change
  -------------------------------------------------- */

  const handleSelectionChange = (type, value) => {

    setSelectedInfra((prev) => ({
      ...prev,
      [type]: value
    }));

  };

  /* --------------------------------------------------
     Save mapping
  -------------------------------------------------- */

  const handleSave = async () => {

    const payload = Object.keys(selectedInfra).reduce((acc, key) => {

      acc[key] = selectedInfra[key].map((i) => i._id);

      return acc;

    }, {});

    if (onSave) await onSave(payload);

  };

  /* --------------------------------------------------
     Summary Panel
  -------------------------------------------------- */

  const renderSummary = () => (
    <Card title="Selected Infrastructure" className="shadow-4">

      <div style={{ overflowY: "auto", paddingRight: "0.5rem" }}>

        {Object.keys(infraData).map((type) => {

          const selected = selectedInfra[type]?.length || 0;
          const total = infraData[type]?.length || 0;

          const progress = total ? (selected / total) * 100 : 0;

          return (
            <div
              key={type}
              style={{
                marginBottom: "1rem",
                padding: "0.5rem",
                borderBottom: "1px solid #eee"
              }}
            >

              <div
                className="flex justify-content-between align-items-center"
                style={{ marginBottom: "0.3rem" }}
              >

                <span style={{ fontWeight: 600 }}>
                  {type.replace("_", " ").toUpperCase()}
                </span>

                <span className="text-600 text-sm">
                  {selected}/{total}
                </span>

              </div>

              <ProgressBar
                value={progress}
                showValue={false}
                style={{ height: "8px" }}
              />

            </div>
          );

        })}

      </div>

      <Button
        label="Save Mapping"
        icon="pi pi-save"
        className="p-button-success p-button-sm w-full mt-2"
        onClick={handleSave}
      />

    </Card>
  );

  /* --------------------------------------------------
     Columns to show
  -------------------------------------------------- */

  const getVisibleFields = (type) => {

    const fieldMap = {

      inverters: ["name", "capacity_kw", "status", "serial_number"],

      batteries: [
        "name",
        "capacity_kwh",
        "usable_capacity_kwh",
        "status"
      ],

      weather_sensors: ["name", "type", "value"],

      grid_meters: ["name", "import_kw", "export_kw", "status"]

    };

    return fieldMap[type] || [];

  };

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */

  return (
    <div className="grid gap-0">

      {/* LEFT PANEL */}

      <div className="col-8">

        <TabView>

          {Object.keys(infraData).map((type) => (

            <TabPanel
              key={type}
              header={type.replace("_", " ").toUpperCase()}
            >

              <DataTable
                value={infraData[type]}
                dataKey="_id"
                selection={selectedInfra[type] || []}
                onSelectionChange={(e) =>
                  handleSelectionChange(type, e.value)
                }
                responsiveLayout="scroll"
                stripedRows
              >

                <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

                {getVisibleFields(type).map((field) => (
                  <Column
                    key={field}
                    field={field}
                    header={field.replace("_", " ").toUpperCase()}
                  />
                ))}

              </DataTable>

            </TabPanel>

          ))}

        </TabView>

      </div>

      {/* RIGHT PANEL */}

      <div className="col-4">
        {renderSummary()}
      </div>

    </div>
  );
};