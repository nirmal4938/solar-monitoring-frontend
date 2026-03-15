import React, { useEffect, useState, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "../../layouts/PageLayout";
import FormSectionCard from "../../ui/organisms/FormSectionCard";
import ActionBar from "../../ui/organisms/ActionBar";

import TextField from "../../ui/molecules/TextField";
import SelectField from "../../ui/molecules/SelectField";

import { useEditUser } from "../../hooks/useEditUser";
import { roleService } from "../../services/roleService";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().when("isEdit", {
    is: false,
    then: (schema) =>
      schema.required("Password required").min(6, "Min 6 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  roles: Yup.array().min(1, "At least one role required"),
});

export const AddEditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { createUser, updateUser, getUserById } = useEditUser();

  const [user, setUser] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ----------------------------------------
  // Load roles
  // ----------------------------------------
  useEffect(() => {
    const loadRoles = async () => {
      const response = await roleService.getAll();
      const roles = response?.data || [];

      setRoleOptions(
        roles.map((r) => ({
          label: r.name,
          value: r.name, // must match user.roles format
        }))
      );
    };

    loadRoles();
  }, []);

  // ----------------------------------------
  // Load user if editing
  // ----------------------------------------
  useEffect(() => {
    if (!isEdit) return;

    const loadUser = async () => {
      try {
        setLoading(true);
        const response = await getUserById(id);
        const userData = response?.data || response;
        // Normalize API → Form format
        const normalizedUser = {
          ...userData,
          status: userData?.is_active ? "ACTIVE" : "INACTIVE",
          roles: userData?.roles || [],
        };

        setUser(normalizedUser);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, isEdit, getUserById]);

  // ----------------------------------------
  // Initial Values
  // ----------------------------------------
  const initialValues = useMemo(() => ({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    status: user?.status || "ACTIVE",
    roles: user?.roles || [],
    isEdit,
  }), [user, isEdit]);


  // ----------------------------------------
  // Submit
  // ----------------------------------------
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        is_active: values.status === "ACTIVE",
        roles: values.roles,
      };

      if (!isEdit) {
        payload.password = values.password;
        await createUser(payload);
      } else {
        await updateUser(id, payload);
      }

      navigate("/users");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLayout>Loading user data...</PageLayout>;

  return (
    <PageLayout>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            {/* USER INFO */}
            <FormSectionCard title="User Information">
              <div className="form-grid-2col">
                <div className="form-field">
                  <TextField
                    name="name"
                    label="Full Name"
                    value={values.name}
                    onChange={(e) =>
                      setFieldValue("name", e.target.value)
                    }
                  />
                </div>

                <div className="form-field">
                  <TextField
                    name="email"
                    label="Email Address"
                    value={values.email}
                    onChange={(e) =>
                      setFieldValue("email", e.target.value)
                    }
                  />
                </div>

                {!isEdit && (
                  <div className="form-field">
                    <TextField
                      name="password"
                      label="Password"
                      type="password"
                      value={values.password}
                      onChange={(e) =>
                        setFieldValue("password", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </FormSectionCard>

            {/* ACCESS CONTROL */}
            <FormSectionCard
              title="Access Control"
              description="Assign roles and manage account status"
            >
              <div className="form-grid-2col">
                <div className="form-field">
                  <SelectField
                    name="roles"
                    label="Roles"
                    options={roleOptions}
                    value={values.roles[0]}
                    onChange={(val) =>
                      setFieldValue("roles", val)
                    }
                    multiple
                  />
                </div>

                <div className="form-field">
                  <SelectField
                    name="status"
                    label="Status"
                    options={[
                      { label: "Active", value: "ACTIVE" },
                      { label: "Inactive", value: "INACTIVE" },
                    ]}
                    value={values.status}
                    onChange={(val) =>
                      setFieldValue("status", val)
                    }
                  />
                </div>
              </div>
            </FormSectionCard>

            <ActionBar
              onCancel={() => navigate("/users")}
              onSubmit={() =>
                document.querySelector("form").requestSubmit()
              }
              submitLabel={isEdit ? "Update User" : "Create User"}
              loading={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </PageLayout>
  );
};