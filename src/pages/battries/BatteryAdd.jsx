import React, { useMemo } from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "../../layouts/PageLayout";
import FormSectionCard from "../../ui/organisms/FormSectionCard";

import TextField from "../../ui/molecules/TextField";
import NumberField from "../../ui/molecules/NumberField";
import DateField from "../../ui/molecules/DateField";
import SelectField from "../../ui/molecules/SelectField";

import { useEditBatteries } from "../../hooks/useEditBattries";

/* --------------------------------------------------- */
/* FIELD WRAPPERS (Formik Binding Layer) */
/* --------------------------------------------------- */

const FText = (props) => {
  const [field] = useField(props.name);
  return <TextField {...props} {...field} />;
};

const FNumber = (props) => {
  const [field, , helpers] = useField(props.name);
  return (
    <NumberField
      {...props}
      value={field.value}
      onChange={(v) => helpers.setValue(v)}
    />
  );
};

const FDate = (props) => {
  const [field, , helpers] = useField(props.name);
  return (
    <DateField
      {...props}
      value={field.value}
      onChange={(v) => helpers.setValue(v)}
    />
  );
};

const FSelect = (props) => {
  const [field, , helpers] = useField(props.name);
  return (
    <SelectField
      {...props}
      value={field.value}
      onChange={(v) => helpers.setValue(v)}
    />
  );
};

/* --------------------------------------------------- */
/* CONSTANTS */
/* --------------------------------------------------- */

const STATUS_OPTIONS = [
  { label: "IDLE", value: "IDLE" },
  { label: "CHARGING", value: "CHARGING" },
  { label: "DISCHARGING", value: "DISCHARGING" },
  { label: "FAULT", value: "FAULT" },
  { label: "OFFLINE", value: "OFFLINE" },
];

const validationSchema = Yup.object({
  name: Yup.string().required("Battery name is required"),
  capacity_kwh: Yup.number().required().positive(),
  usable_capacity_kwh: Yup.number().positive().max(Yup.ref("capacity_kwh")),
  max_charge_kw: Yup.number().nullable(),
  max_discharge_kw: Yup.number().nullable(),
  round_trip_efficiency_pct: Yup.number().min(0).max(100),
  depth_of_discharge_pct: Yup.number().min(0).max(100),
  status: Yup.string().required(),
  commissioning_date: Yup.date().required(),
});

/* --------------------------------------------------- */
/* COMPONENT */
/* --------------------------------------------------- */

export const BatteryAdd = () => {
  const navigate = useNavigate();
  const { id: batteryId } = useParams();

  const { batteryDetails, loading, saveOrUpdateBattery } =
    useEditBatteries(batteryId);

  /* --------------------------------------------------- */
  /* INITIAL VALUES */
  /* --------------------------------------------------- */

  const initialValues = useMemo(() => {
    const empty = {
      name: "",
      capacity_kwh: null,
      usable_capacity_kwh: null,
      max_charge_kw: null,
      max_discharge_kw: null,
      round_trip_efficiency_pct: null,
      depth_of_discharge_pct: null,
      soc_percent: null,
      health_pct: null,
      status: "",
      commissioning_date: null,
    };

    if (!batteryId || !batteryDetails?.battery) return empty;

    const b = batteryDetails.battery;

    return {
      name: b?.name ?? "",
      capacity_kwh: b?.totalCapacity ?? null,
      usable_capacity_kwh: b?.usableCapacity ?? null,
      max_charge_kw: b?.maxChargePower ?? null,
      max_discharge_kw: b?.maxDischargePower ?? null,
      round_trip_efficiency_pct: b?.roundTripEfficiency ?? null,
      depth_of_discharge_pct: b?.depthOfDischarge ?? null,
      soc_percent: b?.soc_percent ?? null,
      health_pct: b?.health_pct ?? null,
      status: b?.status ?? "",
      commissioning_date: b?.commissioningDate
        ? new Date(b.commissioningDate)
        : null,
    };
  }, [batteryId, batteryDetails]);

  /* --------------------------------------------------- */
  /* SUBMIT */
  /* --------------------------------------------------- */

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = { battery: values };

    try {
      await saveOrUpdateBattery(batteryId, payload);
      navigate("/batteries");
    } catch (err) {
      console.error("Battery save error", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (batteryId && loading) {
    return (
      <PageLayout>
        <div style={{ padding: 40, textAlign: "center" }}>
          Loading battery details...
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bb-page">
        <Formik
          enableReinitialize
          validateOnMount
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, errors }) => (
            <Form className="bb-form">
              {/* CORE INFO */}

              <FormSectionCard title="Core Information" dense>
                <div className="bb-grid">
                  <FText name="name" label="Battery Name" />

                  <FNumber name="capacity_kwh" label="Total Capacity (kWh)" />

                  <FNumber
                    name="usable_capacity_kwh"
                    label="Usable Capacity (kWh)"
                  />

                  <FSelect
                    name="status"
                    label="Status"
                    options={STATUS_OPTIONS}
                  />

                  <FDate name="commissioning_date" label="Commissioning Date" />
                </div>
              </FormSectionCard>

              {/* SPECIFICATIONS */}

              <FormSectionCard title="Battery Specifications" dense>
                <div className="bb-grid">
                  <FNumber name="max_charge_kw" label="Max Charge Power (kW)" />
                  <FNumber
                    name="max_discharge_kw"
                    label="Max Discharge Power (kW)"
                  />

                  <FNumber
                    name="round_trip_efficiency_pct"
                    label="Round Trip Efficiency (%)"
                  />

                  <FNumber
                    name="depth_of_discharge_pct"
                    label="Depth of Discharge (%)"
                  />

                  <FNumber name="soc_percent" label="State of Charge (%)" />

                  <FNumber name="health_pct" label="Battery Health (%)" />
                </div>
              </FormSectionCard>

              {/* FOOTER */}

              <div
                style={{
                  position: "sticky",
                  bottom: -30,
                  left: 0,
                  width: "100%",
                  background: "#ffffff",
                  borderTop: "1px solid #e5e7eb",
                  padding: "18px 28px",
                  zIndex: 1000,
                  boxShadow: "0 -6px 20px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  {/* Left section - form helper */}
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      fontWeight: 500,
                    }}
                  >
                    {batteryId
                      ? "Update battery configuration and save changes."
                      : "Create a new battery configuration."}
                  </div>

                  {/* Right section - actions */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => navigate("/batteries")}
                      style={{
                        padding: "10px 18px",
                        fontSize: "14px",
                        fontWeight: 500,
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        background: "#ffffff",
                        color: "#374151",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: "10px 22px",
                        fontSize: "14px",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: "8px",
                        background: "#1e40af",
                        color: "#ffffff",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        opacity: isSubmitting ? 0.7 : 1,
                        boxShadow: "0 2px 8px rgba(30,64,175,0.35)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {isSubmitting
                        ? "Saving..."
                        : batteryId
                          ? "Update Battery"
                          : "Create Battery"}
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </PageLayout>
  );
};
