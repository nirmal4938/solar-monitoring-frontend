import React, { useMemo, useRef } from "react";
import { Formik, Form, useField } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import FormSectionCard from "../../ui/organisms/FormSectionCard";
import TextField from "../../ui/molecules/TextField";
import NumberField from "../../ui/molecules/NumberField";
import SelectField from "../../ui/molecules/SelectField";
import DateField from "../../ui/molecules/DateField";
import { useEditInverters } from "../../hooks/useEditInverters";
import { inverterValidation } from "../../forms/inverterValidation";

/* FIELD WRAPPERS */

const FText = (props) => {
  const [field, , helpers] = useField(props.name);
  return (
    <TextField
      {...props}
      value={field.value || ""}
      onChange={(e) => helpers.setValue(e?.target ? e.target.value : e)}
    />
  );
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

const FSelect = (props) => {
  const [field, , helpers] = useField(props.name);
  return (
    <SelectField
      {...props}
      value={field.value || ""}
      onChange={(v) => helpers.setValue(v)}
    />
  );
};

const FDate = (props) => {
  const [field, , helpers] = useField(props.name);
  const wrapperRef = useRef(null);

  const openCalendar = () => {
    const input = wrapperRef.current?.querySelector("input");
    if (input) {
      input.focus();
      input.click();
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <DateField
        {...props}
        value={field.value || null}
        onChange={(v) => helpers.setValue(v)}
        showButtonBar
        monthNavigator
        yearNavigator
        yearRange="1990:2050"
        dateFormat="yy-mm-dd"
        placeholder="Select date"
        panelStyle={{
          minWidth: "340px",
          padding: "12px",
          borderRadius: "12px",
          boxShadow: "0 14px 34px rgba(0,0,0,0.18)",
          border: "1px solid #e5e7eb",
        }}
        inputStyle={{
          width: "100%",
          padding: "11px 44px 11px 14px",
          fontSize: "14px",
          fontWeight: 500,
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          background: "#ffffff",
        }}
      />

      <i
        className="pi pi-calendar text-blue-800"
        onClick={openCalendar}
        style={{
          position: "absolute",
          right: "12px",
          top: "67%",
          transform: "translateY(-50%)",
          fontSize: "20px",
          cursor: "pointer",
          zIndex: 5,
        }}
      />
    </div>
  );
};

/* OPTIONS */

const STATUS_OPTIONS = [
  { label: "ON", value: "ON" },
  { label: "OFF", value: "OFF" },
  { label: "FAULT", value: "FAULT" },
];

export const InverterAddUpdate = () => {
  const navigate = useNavigate();
  const { id: inverterId } = useParams();

  const { inverter, loading, createInverter, updateInverter } =
    useEditInverters(inverterId);

  const initialValues = useMemo(() => {
    const empty = {
      name: "",
      manufacturer: "",
      model: "",
      serial_number: "",
      capacity_kw: null,
      status: "",
      mppt_count: null,
      string_count: null,
      efficiency_pct: null,
      nominal_ac_voltage_v: null,
      installation_date: "",
      warranty_expiry_date: "",
    };
    if (!inverterId || !inverter) return empty;
    return {
      name: inverter?.name ?? "",
      manufacturer: inverter?.manufacturer ?? "",
      model: inverter?.model ?? "",
      serial_number: inverter?.serial_number ?? "",
      capacity_kw: inverter?.capacity_kw ?? null,
      status: inverter?.status ?? "",
      mppt_count: inverter?.mppt_count ?? null,
      string_count: inverter?.string_count ?? null,
      efficiency_pct: inverter?.efficiency_pct ?? null,
      nominal_ac_voltage_v: inverter?.nominal_ac_voltage_v ?? null,
      installation_date: inverter?.installation_date ?? "",
      warranty_expiry_date: inverter?.warranty_expiry_date ?? "",
    };
  }, [inverterId, inverter]);

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("values", values);
    try {
      if (inverterId) await updateInverter(inverterId, { inverter: values });
      else await createInverter({ inverter: values });
      navigate("/inverters");
    } catch (err) {
      console.error("Inverter save error", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <Formik
        enableReinitialize
        validateOnMount
        initialValues={initialValues}
        validationSchema={inverterValidation}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bb-form">
            <FormSectionCard title="Inverter Information" dense>
              <div className="bb-grid">
                <FText name="name" label="Inverter Name" />
                <FText name="manufacturer" label="Manufacturer" />
                <FText name="model" label="Model" />
                <FText name="serial_number" label="Serial Number" />
                <FNumber name="capacity_kw" label="Capacity (kW)" />
                <FSelect
                  name="status"
                  label="Status"
                  options={STATUS_OPTIONS}
                />
              </div>
            </FormSectionCard>

            <FormSectionCard title="Electrical Specifications" dense>
              <div className="bb-grid">
                <FNumber name="mppt_count" label="MPPT Count" />
                <FNumber name="string_count" label="String Count" />
                <FNumber name="efficiency_pct" label="Efficiency (%)" />
                <FNumber name="nominal_ac_voltage_v" label="AC Voltage (V)" />
              </div>
            </FormSectionCard>

            <FormSectionCard title="Installation Details" dense>
              <div className="grid gap-0">
                <div className="col-6" style={{ position: "relative" }}>
                  <FDate name="installation_date" label="Installation Date" />
                </div>
                <div className="col-6">
                  <FDate name="warranty_expiry_date" label="Warranty Expiry" />
                </div>
              </div>
            </FormSectionCard>

            <div
              style={{
                position: "sticky",
                bottom: -30,
                background: "#fff",
                borderTop: "1px solid #e5e7eb",
                padding: "18px 28px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "#6b7280" }}>
                  {inverterId
                    ? "Update inverter configuration."
                    : "Create new inverter configuration."}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => navigate("/inverters")}
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
                      : inverterId
                        ? "Update Inverter"
                        : "Create Inverter"}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </PageLayout>
  );
};
