import React, { useEffect, useState } from "react";
import "./Placement.css";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Placement() {
  const [placements, setPlacements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const domain = localStorage.getItem("domain");

  const [form, setForm] = useState({
    name: "",
    imageBase64: "",
    college: "",
    company: "",
    position: "",
    packageAmount: "",
  });

  /* ================= FETCH ================= */
  const fetchPlacements = async () => {
    try {
      const res = await fetch(`${API}/api/placements`, {
        headers: { "x-domain": domain },
      });
      const data = await res.json();
      setPlacements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPlacements([]);
    }
  };

  useEffect(() => {
    if (!domain) return alert("Domain missing");
    fetchPlacements();
  }, [domain]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () =>
        setForm({ ...form, imageBase64: reader.result });
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `${API}/api/placements/${editId}`
      : `${API}/api/placements`;

    const method = editId ? "PUT" : "POST";

    const body = {
      name: form.name,
      college: form.college,
      company: form.company,
      position: form.position,
      packageAmount: form.packageAmount,
      imageBase64: form.imageBase64,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-domain": domain,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Save failed");

      resetForm();
      fetchPlacements();
    } catch (err) {
      alert("Error saving placement");
      console.error(err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (p) => {
    setForm({
      name: p.name || "",
      imageBase64: p.image || "",
      college: p.college || "",
      company: p.company || "",
      position: p.position || "",
      packageAmount: p.packageAmount || "",
    });
    setEditId(p._id);
    setShowForm(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this placement?")) return;
    await fetch(`${API}/api/placements/${id}`, {
      method: "DELETE",
      headers: { "x-domain": domain },
    });
    fetchPlacements();
  };

  const resetForm = () => {
    setForm({
      name: "",
      imageBase64: "",
      college: "",
      company: "",
      position: "",
      packageAmount: "",
    });
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="placement-container">
      <h1>Placements</h1>

      <button className="primary-btn" onClick={() => setShowForm(true)}>
        + Add Student
      </button>

      {showForm && (
        <form className="placement-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Student Name" value={form.name} onChange={handleChange} required />
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
          <input name="college" placeholder="College" value={form.college} onChange={handleChange} required />
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
          <input name="position" placeholder="Position" value={form.position} onChange={handleChange} required />
          <input name="packageAmount" placeholder="Package (eg 12 LPA)" value={form.packageAmount} onChange={handleChange} required />

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editId ? "Update" : "Add"}
            </button>
            <button type="button" className="secondary-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="placement-list">
        {placements.map((p) => (
          <div className="placement-card" key={p._id}>
            <img
              src={p.image || "https://via.placeholder.com/120"}
              alt={p.name}
              className="placement-avatar"
            />

            <h3><b>Name : </b>{p.name}</h3>
            <p><b>College:</b> {p.college}</p>
            <p><b>Company:</b> {p.company}</p>
            <p><b>Position:</b> {p.position}</p>
            <span style={{color:"green"}}><b>Package: {p.packageAmount} </b></span>

            <div className="card-actions">
              <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
