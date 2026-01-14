import React, { useEffect, useState } from "react";
import "./career.css";

const API = `${import.meta.env.VITE_API_BASE_URL}/api/careers`;
const DOMAIN = localStorage.getItem("domain");

function Career() {
  const [careers, setCareers] = useState([]);
  const [form, setForm] = useState({
    isHiring: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
          domain: DOMAIN,
        },
      });

      const json = await res.json();
      setCareers(json.data || []);
    } catch (err) {
      console.error("Fetch careers error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/${editingId}` : API;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          domain: DOMAIN,
        },
        body: JSON.stringify({
          ...form,
          requirements: form.requirements
            ? form.requirements.split(",").map((x) => x.trim())
            : [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ isHiring: true });
      fetchCareers();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (career) => {
    setForm({
      ...career,
      requirements: career.requirements?.join(", "),
    });
    setEditingId(career._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this opening?")) return;

    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          domain: DOMAIN,
        },
      });

      fetchCareers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="career-container">
      <div className="career-header">
        <h1>Career Openings</h1>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Add Opening
        </button>
      </div>

      {showForm && (
        <form className="career-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Opening" : "Add New Opening"}</h3>

          <input
            placeholder="Job Title"
            required
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <select
            required
            value={form.type || ""}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="">Select Job Type</option>
            <option value="Internship">Internship</option>
            <option value="Job">Job</option>
            <option value="JobAtOrange">JobAtOrange</option>
          </select>

          <input
            placeholder="Company Name"
            value={form.company || ""}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />

          <input
            placeholder="Position"
            value={form.position || ""}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />

          <textarea
            placeholder="Eligibility"
            required
            value={form.eligibility || ""}
            onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
          />

          <input
            placeholder="Requirements (comma separated)"
            value={form.requirements || ""}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          />

          <input
            placeholder="Stipend"
            value={form.stipend || ""}
            onChange={(e) => setForm({ ...form, stipend: e.target.value })}
          />

          <input
            placeholder="Salary"
            value={form.salary || ""}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />

          <input
            placeholder="Location"
            required
            value={form.location || ""}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <input
            placeholder="Experience"
            required
            value={form.experience || ""}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />

          <select
            value={String(form.isHiring)}
            onChange={(e) =>
              setForm({ ...form, isHiring: e.target.value === "true" })
            }
          >
            <option value="true">Hiring Open</option>
            <option value="false">Hiring Closed</option>
          </select>

          <input
            placeholder="Logo URL"
            value={form.logo || ""}
            onChange={(e) => setForm({ ...form, logo: e.target.value })}
          />

          <div className="form-actions">
            <button type="submit" className="btn-save">
              {editingId ? "Update" : "Save"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="career-grid">
        {careers.map((c) => (
          <div key={c._id} className="career-card">
            {/* ✅ LOGO DISPLAY FIX */}
            {c.logo && (
              <img
                src={c.logo}
                alt="Company Logo"
                className="career-logo"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}

            <h3>{c.title}</h3>
            <p>
              <b>Type:</b> {c.type}
            </p>
            <p>
              <b>Company:</b> {c.company}
            </p>
            <p>
              <b>Position:</b> {c.position}
            </p>
            <p>
              <b>Eligibility:</b> {c.eligibility}
            </p>
            <p>
              <b>Location:</b> {c.location}
            </p>
            <p>
              <b>Experience:</b> {c.experience}
            </p>
            <p>
              <b>Salary:</b> {c.salary}
            </p>
            <p>
              <b>Stipend:</b> {c.stipend}
            </p>
            <p>
              <b>Status:</b> {c.isHiring ? "Hiring Open" : "Closed"}
            </p>

            <ul>
              {c.requirements?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <div className="card-actions">
              <button onClick={() => handleEdit(c)}>Edit</button>
              <button onClick={() => handleDelete(c._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Career;
