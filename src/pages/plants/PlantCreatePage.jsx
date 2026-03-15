// PlantCreatePage (Enterprise-grade, Sticky Bottom CTA)
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "../../layouts/PageLayout";
import FormSectionCard from "../../ui/organisms/FormSectionCard";

import TextField from "../../ui/molecules/TextField";
import NumberField from "../../ui/molecules/NumberField";
import DateField from "../../ui/molecules/DateField";
import SelectField from "../../ui/molecules/SelectField";
import CurrencyField from "../../ui/molecules/CurrencyField";

import { useEditPlant } from "../../hooks/useEditPlant";

const PLANT_TYPE_OPTIONS = [
  { label: "Residential", value: "RESIDENTIAL" },
  { label: "Industrial", value: "INDUSTRIAL" },
  { label: "Utility Scale", value: "UTILITY" },
];

const validationSchema = Yup.object({
  name: Yup.string().required("Plant name is required"),
  capacity_kw: Yup.number().required("Capacity required").positive(),
  latitude: Yup.number().required("Latitude required"),
  longitude: Yup.number().required("Longitude required"),
  commissioning_date: Yup.date().required("Required"),
});

export const PlantCreatePage = () => {
  const navigate = useNavigate();
  const { id: plantId } = useParams();
  const { plant, loading, updatePlant } = useEditPlant(plantId);

  const initialValues = {
    name: plant?.name || "",
    capacity_kw: plant?.capacity_kw || null,
    location: plant?.location || "",
    latitude: plant?.latitude || null,
    longitude: plant?.longitude || null,
    plant_type: plant?.plant_type || "",
    commissioning_date: plant?.commissioning_date
      ? new Date(plant.commissioning_date)
      : null,
    import_rate_per_kwh: plant?.tariff_config?.import_rate_per_kwh || null,
    export_rate_per_kwh: plant?.tariff_config?.export_rate_per_kwh || null,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        plant: {
          name: values.name,
          capacity_kw: values.capacity_kw,
          location: values.location,
          latitude: values.latitude,
          longitude: values.longitude,
          plant_type: values.plant_type,
          commissioning_date: values.commissioning_date,
        },
        tariff_config: {
          import_rate_per_kwh: values.import_rate_per_kwh,
          export_rate_per_kwh: values.export_rate_per_kwh,
          currency: "INR",
        },
      };

      if (plantId) {
        await updatePlant(payload, plantId);
      } else {
        console.log("CREATE PLANT PAYLOAD", payload);
      }

      navigate("/plants");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLayout>Loading plant data...</PageLayout>;

  return (
    <PageLayout>
      <div className="bb-page">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="bb-form">
              {/* CORE INFORMATION */}
              <FormSectionCard title="Core Information" dense>
                <div className="bb-grid">
                  <TextField
                    name="name"
                    label="Plant Name"
                    value={values.name}
                    onChange={(e) => setFieldValue("name", e.target.value)}
                  />
                  <SelectField
                    name="plant_type"
                    label="Plant Type"
                    options={PLANT_TYPE_OPTIONS}
                    value={values.plant_type}
                    onChange={(val) => setFieldValue("plant_type", val)}
                  />
                  <NumberField
                    name="capacity_kw"
                    label="Installed Capacity (kW)"
                    value={values.capacity_kw}
                    onChange={(val) => setFieldValue("capacity_kw", val)}
                  />
                  <DateField
                    name="commissioning_date"
                    label="Commissioning Date"
                    value={values.commissioning_date}
                    onChange={(val) => setFieldValue("commissioning_date", val)}
                  />
                </div>
              </FormSectionCard>

              {/* LOCATION */}
              <FormSectionCard
                title="Location & Grid Data"
                description="Geospatial and siting details"
                dense
              >
                <div className="bb-grid">
                  <TextField
                    name="location"
                    label="Location"
                    value={values.location}
                    onChange={(e) => setFieldValue("location", e.target.value)}
                  />
                  <NumberField
                    name="latitude"
                    label="Latitude"
                    value={values.latitude}
                    onChange={(val) => setFieldValue("latitude", val)}
                  />
                  <NumberField
                    name="longitude"
                    label="Longitude"
                    value={values.longitude}
                    onChange={(val) => setFieldValue("longitude", val)}
                  />
                </div>
              </FormSectionCard>

              {/* TARIFF */}
              <FormSectionCard
                title="Tariff Configuration"
                description="Import and export pricing"
                dense
              >
                <div className="bb-grid">
                  <CurrencyField
                    name="import_rate_per_kwh"
                    label="Import Rate (₹ / kWh)"
                    value={values.import_rate_per_kwh}
                    onChange={(val) =>
                      setFieldValue("import_rate_per_kwh", val)
                    }
                  />
                  <CurrencyField
                    name="export_rate_per_kwh"
                    label="Export Rate (₹ / kWh)"
                    value={values.export_rate_per_kwh}
                    onChange={(val) =>
                      setFieldValue("export_rate_per_kwh", val)
                    }
                  />
                </div>
              </FormSectionCard>

              {/* STICKY BOTTOM BAR */}
              <div className="bb-sticky-bar">
                <div className="bb-sticky-inner">
                  <button
                    type="button"
                    className="bb-btn-secondary"
                    onClick={() => navigate("/plants")}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bb-btn-primary"
                    disabled={isSubmitting}
                  >
                    {plantId ? "Update Plant" : "Create Plant"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* =========================== STYLES =========================== */}
      <style>{`
        .bb-page {
          width: 100%;
          padding: 24px 36px 120px 36px;
          background: #f8fafc;
        }

        .bb-form {
          font-size: 13px;
        }

        .bb-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 18px 24px;
        }

        .bb-form .p-card {
          padding: 22px 28px !important;
          margin-bottom: 20px !important;
          border: 1px solid #d1d5db !important;
          border-radius: 12px !important;
          background: #ffffff !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .bb-form .p-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }

        .bb-form label {
          font-size: 12px !important;
          font-weight: 500;
          margin-bottom: 6px !important;
          display: block;
          color: #374151;
        }

        .bb-form input,
        .bb-form .p-inputtext,
        .bb-form .p-dropdown,
        .bb-form .p-calendar {
          height: 36px !important;
          font-size: 13px !important;
          padding: 0 10px;
        }

        .bb-form .p-dropdown-label {
          line-height: 36px !important;
        }

        /* Sticky Bottom Bar */
        .bb-sticky-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: #ffffff;
          border-top: 1.5px solid #d1d5db;
          padding: 14px 36px;
          z-index: 110;
        }

        .bb-sticky-inner {
          display: flex;
          justify-content: flex-end;
          gap: 14px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .bb-btn-primary {
          background: #1f2937;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          font-size: 13px;
          cursor: pointer;
          border-radius: 6px;
          transition: background 0.2s ease;
        }

        .bb-btn-primary:hover {
          background: #111827;
        }

        .bb-btn-secondary {
          background: #e5e7eb;
          border: 1px solid #d1d5db;
          padding: 10px 20px;
          font-size: 13px;
          cursor: pointer;
          border-radius: 6px;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .bb-btn-secondary:hover {
          background: #d1d5db;
        }
      `}</style>
    </PageLayout>
  );
};
