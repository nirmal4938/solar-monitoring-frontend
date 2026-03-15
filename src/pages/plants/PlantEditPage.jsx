import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
// import { createPlant, updatePlant, getPlantById } from "../../services/plantService";

const validationSchema = Yup.object({
  name: Yup.string().required("Plant name is required"),
  capacity_kw: Yup.number().required().positive(),
});

export const PlantEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [initialValues, setInitialValues] = useState({
    name: "",
    capacity_kw: "",
    location: "",
    latitude: "",
    longitude: "",
    commissioning_date: null,
    plant_type: "",
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchPlant = async () => {
        try {
          // const data = await getPlantById(id);
          // setInitialValues(data);

          // Temporary mock
          setInitialValues({
            name: "Solar One",
            capacity_kw: 500,
            location: "Gujarat, India",
            latitude: 23.0225,
            longitude: 72.5714,
            commissioning_date: new Date("2024-01-15"),
            plant_type: "UTILITY",
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchPlant();
    }
  }, [id, isEditMode]);

  return (
    <div
      className="p-4"
      style={{ background: "#f8fafc", minHeight: "100vh" }}
    >
      <h2 style={{ marginBottom: "20px", fontWeight: 600 }}>
        {isEditMode ? "Edit Plant" : "Create Plant"}
      </h2>

      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "6px",
          border: "1px solid #e6e9ef",
          boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
        }}
      >
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              if (isEditMode) {
                // await updatePlant(id, values);
              } else {
                // await createPlant(values);
              }
              navigate("/plants");
            } catch (err) {
              console.error(err);
            }
          }}
        >
          {({ values, handleChange, setFieldValue }) => (
            <Form className="grid formgrid p-fluid">

              <div className="field col-12 md:col-6">
                <label>Plant Name</label>
                <InputText
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                />
              </div>

              <div className="field col-12 md:col-6">
                <label>Capacity (kW)</label>
                <InputText
                  name="capacity_kw"
                  value={values.capacity_kw}
                  onChange={handleChange}
                />
              </div>

              <div className="field col-12 md:col-6">
                <label>Location</label>
                <InputText
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                />
              </div>

              <div className="field col-12 md:col-3">
                <label>Latitude</label>
                <InputText
                  name="latitude"
                  value={values.latitude}
                  onChange={handleChange}
                />
              </div>

              <div className="field col-12 md:col-3">
                <label>Longitude</label>
                <InputText
                  name="longitude"
                  value={values.longitude}
                  onChange={handleChange}
                />
              </div>

              <div className="field col-12 md:col-6">
                <label>Commissioning Date</label>
                <Calendar
                  value={values.commissioning_date}
                  onChange={(e) =>
                    setFieldValue("commissioning_date", e.value)
                  }
                  dateFormat="yy-mm-dd"
                  showIcon
                />
              </div>

              <div className="field col-12 md:col-6">
                <label>Plant Type</label>
                <Dropdown
                  value={values.plant_type}
                  options={[
                    { label: "Residential", value: "RESIDENTIAL" },
                    { label: "Industrial", value: "INDUSTRIAL" },
                    { label: "Utility", value: "UTILITY" },
                  ]}
                  onChange={(e) =>
                    setFieldValue("plant_type", e.value)
                  }
                  placeholder="Select Type"
                />
              </div>

              <div className="col-12 flex justify-content-end gap-2 mt-4">
                <Button
                  label="Cancel"
                  className="p-button-text p-button-sm"
                  onClick={() => navigate("/plants")}
                  type="button"
                />
                <Button
                  label={isEditMode ? "Update" : "Create"}
                  icon="pi pi-check"
                  className="p-button-sm"
                  style={{ background: "#1f3a8a", border: "none" }}
                  type="submit"
                />
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};