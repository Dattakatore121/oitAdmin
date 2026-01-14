import React, { useEffect, useState } from "react";
import "./Applied.css";

const API = `${import.meta.env.VITE_API_BASE_URL}/api/applied`;

function Applied() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCover, setSelectedCover] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch");

      setApplications(result.data || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (!token) {
    return <p className="error">Unauthorized – Please login</p>;
  }

  // 🔍 Search filter
  const filteredApplications = applications.filter((app) =>
    app.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="applied-container">
      <h2 className="page-title">Applied Candidates</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <table className="applied-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Cover Letter</th>
              <th>Resume</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty">
                  No Applications Found
                </td>
              </tr>
            ) : (
              filteredApplications.map((app, index) => (
                <tr key={app._id}>
                  <td>{index + 1}</td>
                  <td>{app.fullName}</td>
                  <td>{app.email}</td>
                  <td>{app.phone}</td>
                  <td>{app.country || "—"}</td>

                  {/* Cover Letter */}
                  <td>
                    {app.coverLetter ? (
                      <button
                        className="btn-view"
                        onClick={() => setSelectedCover(app)}
                      >
                        View
                      </button>
                    ) : (
                      "N/A"
                    )}
                  </td>

                  {/* ✅ RESUME PDF VIEW */}
                  <td>
                    {app.resume ? (
                      <a
                        href={`${API}/resume/${app._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="resume-link"
                      >
                        View
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>

                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(app._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* 📝 Cover Letter Modal */}
      {selectedCover && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Cover Letter</h3>
            <p className="cover-text">{selectedCover.coverLetter}</p>

            <button
              className="btn-close"
              onClick={() => setSelectedCover(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applied;
