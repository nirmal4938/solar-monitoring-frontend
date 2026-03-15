import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "../../layouts/PageLayout";
import FormSectionCard from "../../ui/organisms/FormSectionCard";
import ActionBar from "../../ui/organisms/ActionBar";

import { useEditUser } from "../../hooks/useEditUser";

export const UserViewPage = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const { getUserById } = useEditUser();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------------
  // Fetch User
  // ------------------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        setUser(data?.data || data);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (loading) {
    return <PageLayout>Loading user details...</PageLayout>;
  }

  if (!user) {
    return <PageLayout>User not found</PageLayout>;
  }

  return (
    <PageLayout>
      {/* ---------------------------------- */}
      {/* Core Information */}
      {/* ---------------------------------- */}
      <FormSectionCard title="User Information">
        <div className="form-grid-2col">
          <div className="form-field">
            <label className="view-label">Full Name</label>
            <div className="view-value">{user.name || "-"}</div>
          </div>

          <div className="form-field">
            <label className="view-label">Email</label>
            <div className="view-value">{user.email || "-"}</div>
          </div>

          <div className="form-field">
            <label className="view-label">Status</label>
            <div className="view-value">
              {user.isActive ? (
                <span className="badge badge-success">Active</span>
              ) : (
                <span className="badge badge-danger">Inactive</span>
              )}
            </div>
          </div>

          <div className="form-field">
            <label className="view-label">Created At</label>
            <div className="view-value">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleString()
                : "-"}
            </div>
          </div>
        </div>
      </FormSectionCard>

      {/* ---------------------------------- */}
      {/* Roles */}
      {/* ---------------------------------- */}
      <FormSectionCard
        title="Assigned Roles"
        description="Roles determine system-level access permissions"
      >
        {user.roles && user.roles.length > 0 ? (
          <div className="role-list">
            {user.roles.map((role) => (
              <span key={role._id} className="badge badge-primary">
                {role.name}
              </span>
            ))}
          </div>
        ) : (
          <div className="view-value">No roles assigned</div>
        )}
      </FormSectionCard>

      {/* ---------------------------------- */}
      {/* Action Bar */}
      {/* ---------------------------------- */}
      <ActionBar
        onCancel={() => navigate("/users")}
        onSubmit={() => navigate(`/users/${userId}/edit`)}
        submitLabel="Edit User"
      />
    </PageLayout>
  );
};