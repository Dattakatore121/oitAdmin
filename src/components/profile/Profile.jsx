import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
const API = `${import.meta.env.VITE_API_BASE_URL}`;
const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Unauthorized. Please login again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API}/api/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAdmin(res.data.admin);
      } catch (err) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  if (!admin) {
    return <div className="profile-error">No profile data found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Admin Profile</h2>

        <div className="profile-row">
          <span>First Name</span>
          <p>{admin.firstName || "-"}</p>
        </div>

        <div className="profile-row">
          <span>Last Name</span>
          <p>{admin.lastName || "-"}</p>
        </div>

        <div className="profile-row">
          <span>Email</span>
          <p>{admin.email || "-"}</p>
        </div>

        <div className="profile-row">
          <span>Mobile</span>
          <p>{admin.mobile || "-"}</p>
        </div>

        <div className="profile-row">
          <span>Company</span>
          <p>{admin.companyName || "-"}</p>
        </div>

        <div className="profile-row">
          <span>Domain</span>
          <p>{admin.domain || "-"}</p>
        </div>

        <div className="profile-row">
          <span>Address</span>
          <p>{admin.address || "-"}</p>
        </div>

        <div className="profile-footer">
          <small>Account created on</small>
          <p>{new Date(admin.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
