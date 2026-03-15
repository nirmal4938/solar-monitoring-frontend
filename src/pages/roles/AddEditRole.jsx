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
import { useEditRole } from "../../hooks/useEditRole";
import './role.css';
import { useAuth } from "../../context/AuthContext";

const validationSchema = Yup.object({
  name: Yup.string().required("Role name required"),
});

export const AddEditRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { getRoleById, permissions, saveRole } = useEditRole();
  const { organizationId } = useAuth();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // -------------------------------------------------
  // Load Role AFTER permissions are ready
  // -------------------------------------------------
  useEffect(() => {
    if (!isEdit || permissions.length === 0) return; // wait until permissions are loaded

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

  // -------------------------------------------------
  // Permission matrix
  // -------------------------------------------------
  const permissionMatrix = useMemo(() => {
    const grouped = {};
    permissions?.forEach((p) => {
      if (!grouped[p.resource]) grouped[p.resource] = [];
      grouped[p.resource].push(p.action);
    });
    return grouped;
  }, [permissions]);

  // -------------------------------------------------
  // Formik initial values
  // -------------------------------------------------
  const initialValues = useMemo(() => ({
    name: role?.name || "",
    description: role?.description || "",
  }), [role]);

  // -------------------------------------------------
  // Permission handlers
  // -------------------------------------------------
  const togglePermission = (resource, action) => {
    const key = `${resource}_${action}`;
    setSelectedPermissions(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  const toggleResource = (resource) => {
    const actions = permissionMatrix[resource] || [];
    const allSelected = actions.every(a => selectedPermissions.includes(`${resource}_${a}`));
    if (allSelected) {
      setSelectedPermissions(prev =>
        prev.filter(p => !actions.map(a => `${resource}_${a}`).includes(p))
      );
    } else {
      const newSelections = actions
        .map(a => `${resource}_${a}`)
        .filter(key => !selectedPermissions.includes(key));
      setSelectedPermissions(prev => [...prev, ...newSelections]);
    }
  };

  const toggleAllPermissions = () => {
    const allKeys = Object.keys(permissionMatrix).flatMap(resource =>
      permissionMatrix[resource].map(action => `${resource}_${action}`)
    );
    const allSelected = allKeys.every(k => selectedPermissions.includes(k));
    setSelectedPermissions(allSelected ? [] : allKeys);
  };

  // -------------------------------------------------
  // Submit handler
  // -------------------------------------------------
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

  if (loading) return <PageLayout>Loading role data...</PageLayout>;

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

            <FormSectionCard
              title="Permission Matrix"
              description={`Selected: ${selectedPermissions.length} permissions`}
            >
              <div className="flex justify-content-between align-items-center mb-3">
                <InputText
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search resource"
                  className="w-20rem"
                />
                <div className="flex align-items-center gap-2">
                  <Checkbox
                    checked={Object.keys(permissionMatrix)
                      .flatMap(r => permissionMatrix[r].map(a => `${r}_${a}`))
                      .every(k => selectedPermissions.includes(k))}
                    onChange={toggleAllPermissions}
                  />
                  <label className="text-sm font-medium">Select All</label>
                </div>
              </div>

              <Divider className="my-2" />

              <div className="grid text-sm font-medium text-600 px-2 py-2">
                <div className="col-4">Resource</div>
                {Object.values(permissionMatrix).flat()
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .map(action => (
                    <div key={action} className="col text-center">{action}</div>
                  ))}
              </div>

              <Divider className="my-2" />

              {Object.keys(permissionMatrix)
                .filter(resource => resource.toLowerCase().includes(search.toLowerCase()))
                .map(resource => {
                  const actions = permissionMatrix[resource];
                  const allActions = Object.values(permissionMatrix).flat()
                    .filter((v, i, a) => a.indexOf(v) === i);
                  const allSelected = actions.every(a => selectedPermissions.includes(`${resource}_${a}`));

                  return (
                    <div key={resource}>
                      <div className="grid align-items-center px-2 py-3">
                        <div className="col-4 flex align-items-center gap-3">
                          <Checkbox checked={allSelected} onChange={() => toggleResource(resource)} />
                          <span className="font-medium">{resource}</span>
                        </div>
                        {allActions.map(action => {
                          const key = `${resource}_${action}`;
                          const available = actions.includes(action);
                          const checked = selectedPermissions.includes(key);
                          return (
                            <div key={action} className="col text-center">
                              {available
                                ? <Checkbox checked={checked} onChange={() => togglePermission(resource, action)} />
                                : <span className="text-300">—</span>
                              }
                            </div>
                          );
                        })}
                      </div>
                      <Divider className="my-1" />
                    </div>
                  );
                })}
            </FormSectionCard>

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