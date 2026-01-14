import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Contact.css";
const API = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${API}/api/contact-info`;

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const domain = localStorage.getItem("domain"); // 🔥 domain from localStorage

  /* ================= FETCH ================= */
  const fetchContacts = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { domain }, // send domain
      });

      const result = res.data.data;

      if (result) {
        setContacts(Array.isArray(result) ? result : [result]);
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.error(err);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(e.target);

    const payload = {
      domain,
      name: form.get("name"),
      phones: [form.get("contact1"), form.get("contact2")].filter(Boolean),
      email: form.get("email"),
      openingTime: form.get("openingTime"),
      closingTime: form.get("closingTime"),
      address: form.get("address"),
      fullAddress: form.get("fullAddress"),
    };

    try {
      // 🔹 Always use POST. Backend will handle create/update based on domain
      await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(editingId ? "✅ Updated successfully" : "✅ Saved successfully");
      e.target.reset();
      setEditingId(null);
      fetchContacts();
    } catch (err) {
      console.error(err);
      setMessage("❌ Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (c) => {
    setEditingId(c._id);

    const form = document.querySelector(".contact-form");
    form.name.value = c.name || "";
    form.contact1.value = c.phones?.[0] || "";
    form.contact2.value = c.phones?.[1] || "";
    form.email.value = c.email || "";
    form.openingTime.value = c.openingTime || "";
    form.closingTime.value = c.closingTime || "";
    form.address.value = c.address || "";
    form.fullAddress.value = c.fullAddress || "";
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete contact info?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑️ Deleted successfully");
      fetchContacts();
    } catch (err) {
      console.error(err);
      setMessage("❌ Delete failed");
    }
  };

  return (
    <div className="contact-admin-container">
      <h2 className="page-title">📞 Contact Settings</h2>

      {/* ================= FORM ================= */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Company / Person Name" required />
        <input name="contact1" placeholder="Contact Number 1" required />
        <input name="contact2" placeholder="Contact Number 2" />
        <input name="email" placeholder="Email" required />
        <input type="time" name="openingTime" />
        <input type="time" name="closingTime" />
        <input name="address" placeholder="Short Address" />
        <textarea name="fullAddress" placeholder="Full Address" />

        <button className="save-btn" disabled={loading}>
          {loading
            ? "Saving..."
            : editingId
            ? "Update Contact"
            : "Save Contact"}
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>

      {/* ================= TABLE ================= */}
      <table className="contact-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phones</th>
            <th>Timing</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {contacts.length === 0 ? (
            <tr>
              <td colSpan="6">No contact info found</td>
            </tr>
          ) : (
            contacts.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>
                  {c.phones && c.phones.length > 0 ? c.phones.join(", ") : "--"}
                </td>
                <td>
                  {c.openingTime || "--"} - {c.closingTime || "--"}
                </td>
                <td>{c.address || "--"}</td>
                <td className="action-btns">
                  <button className="edit-btn" onClick={() => handleEdit(c)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Contact;
