// AddEditRole.jsx

import React, { useEffect, useState, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "../../layouts/PageLayout";
import FormSectionCard from "../../ui/organisms/FormSectionCard";
import ActionBar from "../../ui/organisms/ActionBar";
import TextField from "../../ui/molecules/TextField";

import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";

import { useEditRole } from "../../hooks/useEditRole";
import { useAuth } from "../../context/AuthContext";
import { usePageLoader } from "../../hooks/usePageLoader";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import "./role.css";

const validationSchema = Yup.object({
  name: Yup.string().required("Role name required"),
});

export const AddEditRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [activeResource, setActiveResource] = useState(null);
  const { getRoleById, permissions, saveRole } = useEditRole();
  const { organizationId } = useAuth();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------- */
  /* Load role */
  /* -------------------------------------------------- */

  useEffect(() => {
    if (!isEdit || permissions.length === 0) return;

    let mounted = true;

    const loadRole = async () => {
      try {
        setLoading(true);

        const response = await getRoleById(id);

        if (mounted) {
          setRole(response);
          setSelectedPermissions(response.permissions || []);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadRole();

    return () => {
      mounted = false;
    };
  }, [id, isEdit, permissions, getRoleById]);

  /* -------------------------------------------------- */
  /* Group permissions by resource */
  /* -------------------------------------------------- */

  const permissionMatrix = useMemo(() => {
    const grouped = {};

    permissions?.forEach((p) => {
      if (!grouped[p.resource]) grouped[p.resource] = [];
      grouped[p.resource].push(p.action);
    });

    return grouped;
  }, [permissions]);

  /* -------------------------------------------------- */
  /* Role form initial values */
  /* -------------------------------------------------- */

  const initialValues = useMemo(
    () => ({
      name: role?.name || "",
      description: role?.description || "",
    }),
    [role],
  );

  /* -------------------------------------------------- */
  /* Permission helpers */
  /* -------------------------------------------------- */

  const togglePermission = (resource, action) => {
    const key = `${resource}_${action}`;

    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key],
    );
  };

  const toggleResource = (resource) => {
    const actions = permissionMatrix[resource] || [];

    const keys = actions.map((a) => `${resource}_${a}`);

    const allSelected = keys.every((k) => selectedPermissions.includes(k));

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((p) => !keys.includes(p)));
    } else {
      const newKeys = keys.filter((k) => !selectedPermissions.includes(k));

      setSelectedPermissions((prev) => [...prev, ...newKeys]);
    }
  };

  const toggleAllPermissions = () => {
    const allKeys = Object.keys(permissionMatrix).flatMap((r) =>
      permissionMatrix[r].map((a) => `${r}_${a}`),
    );

    const allSelected = allKeys.every((k) => selectedPermissions.includes(k));

    setSelectedPermissions(allSelected ? [] : allKeys);
  };

  /* -------------------------------------------------- */
  /* Submit */
  /* -------------------------------------------------- */

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await saveRole({
        id,
        values,
        permissions: selectedPermissions,
        organization_id: organizationId,
      });

      navigate("/roles");
    } finally {
      setSubmitting(false);
    }
  };

  usePageLoader(loading);

  /* -------------------------------------------------- */
  /* Filtered resources */
  /* -------------------------------------------------- */

  const filteredResources = Object.keys(permissionMatrix).filter((r) =>
    r.toLowerCase().includes(search.toLowerCase()),
  );

  const allPermissionKeys = Object.keys(permissionMatrix).flatMap((resource) =>
    permissionMatrix[resource].map((action) => `${resource}_${action}`),
  );

  const allSelected = allPermissionKeys.every((k) =>
    selectedPermissions.includes(k),
  );

  /* -------------------------------------------------- */
  /* Render */
  /* -------------------------------------------------- */

  return (
    <PageLayout>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, submitForm }) => (
          <Form>
            {/* -------------------------------------------------- */}
            {/* Role Info */}
            {/* -------------------------------------------------- */}

            <FormSectionCard title="Role Information">
              <div className="form-grid-2col">
                <TextField
                  name="name"
                  label="Role Name"
                  value={values.name || ""}
                  onChange={(val) => setFieldValue("name", val)}
                />

                <TextField
                  name="description"
                  label="Description"
                  value={values.description || ""}
                  onChange={(val) => setFieldValue("description", val)}
                />
              </div>
            </FormSectionCard>

            {/* -------------------------------------------------- */}
            {/* Permissions */}
            {/* -------------------------------------------------- */}

            <FormSectionCard
              title="Permissions"
              description={`Selected: ${selectedPermissions.length}`}
            >
              {/* Search + global select */}

              <div className="flex justify-content-between align-items-center mb-3">
                <InputText
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search resource..."
                  className="w-20rem"
                />

                <div className="flex align-items-center gap-2">
                  <Checkbox
                    checked={allSelected}
                    onChange={toggleAllPermissions}
                  />
                  <label className="text-sm font-medium">Select All</label>
                </div>
              </div>

              <Divider />

              {/* Resource cards */}

              <div className="grid gap-0">
                {filteredResources.map((resource) => {
                  const actions = permissionMatrix[resource];

                  const keys = actions.map((a) => `${resource}_${a}`);

                  const resourceSelected = keys.every((k) =>
                    selectedPermissions.includes(k),
                  );

                  return (
                    <>
                      <div key={resource} className="col-12 md:col-6 lg:col-4">
                        <Card
                          className="h-full flex flex-column"
                          pt={{
                            header: {
                              className:
                                "bg-blue-800 text-white px-3 py-2 border-round-top flex align-items-center justify-content-between",
                            },
                            body: {
                              className: "p-3 flex flex-column gap-2",
                            },
                          }}
                          title={
                            <div className="flex align-items-center justify-content-between w-full">
                              <div className="flex align-items-center gap-2">
                                <Checkbox
                                  checked={resourceSelected}
                                  onChange={() => toggleResource(resource)}
                                  pt={{
                                    box: {
                                      className:
                                        "border-blue-800 border-2 w-1rem h-1rem border-round-sm",
                                    },
                                    icon: { className: "text-white" },
                                  }}
                                />

                                <span className="font-semibold text-blue-800 text-sm">
                                  {resource}
                                </span>
                              </div>

                              <span className="text-xs text-blue-900">
                                {actions.length} permissions
                              </span>
                            </div>
                          }
                        >
                          <div className="flex flex-column gap-2">
                            {actions.slice(0, 3).map((action) => {
                              const key = `${resource}_${action}`;
                              const checked = selectedPermissions.includes(key);

                              return (
                                <div
                                  key={action}
                                  className="flex align-items-center justify-content-between px-3 py-2 border-1 border-blue-200 border-round bg-blue-50"
                                >
                                  <div className="flex align-items-center gap-2">
                                    <Checkbox
                                      checked={checked}
                                      onChange={() =>
                                        togglePermission(resource, action)
                                      }
                                      pt={{
                                        box: {
                                          className:
                                            "border-blue-800 border-2 w-1rem h-1rem border-round-sm",
                                        },
                                        icon: { className: "text-white" },
                                      }}
                                    />

                                    <label className="text-sm font-medium text-blue-900">
                                      {action}
                                    </label>
                                  </div>
                                </div>
                              );
                            })}

                            {actions.length > 3 && (
                              <Button
                                type="button"
                                text
                                size="small"
                                label={`+${actions.length - 3} more`}
                                className="text-blue-800 font-medium align-self-start"
                                onClick={() => {
                                  setActiveResource(resource);
                                  setDialogVisible(true);
                                }}
                              />
                            )}
                          </div>
                        </Card>
                      </div>

                      {/* Dialog */}

                      <Dialog
                        header={`${activeResource} Permissions`}
                        visible={dialogVisible && activeResource === resource}
                        style={{ width: "420px" }}
                        modal
                        onHide={() => setDialogVisible(false)}
                        pt={{
                          header: {
                            className: "bg-blue-800 text-white px-4 py-3",
                          },
                          content: {
                            className: "p-4",
                          },
                        }}
                      >
                        <div className="flex flex-column gap-2">
                          {actions.map((action) => {
                            const key = `${resource}_${action}`;
                            const checked = selectedPermissions.includes(key);

                            return (
                              <div
                                key={action}
                                className="flex align-items-center justify-content-between px-3 py-2 border-1 border-blue-200 border-round bg-blue-50"
                              >
                                <span className="text-sm font-medium text-blue-900">
                                  {action}
                                </span>

                                <Checkbox
                                  checked={checked}
                                  onChange={() =>
                                    togglePermission(resource, action)
                                  }
                                  pt={{
                                    box: {
                                      className:
                                        "border-blue-800 border-2 w-1rem h-1rem border-round-sm",
                                    },
                                    icon: { className: "text-white" },
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </Dialog>
                    </>
                  );
                })}
              </div>
            </FormSectionCard>

            {/* -------------------------------------------------- */}
            {/* Actions */}
            {/* -------------------------------------------------- */}

            <ActionBar
              onCancel={() => navigate("/roles")}
              onSubmit={submitForm}
              submitLabel={isEdit ? "Update Role" : "Create Role"}
              loading={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </PageLayout>
  );
};
