import { useEffect, useState } from "react";
import "./AddBatch.css";

const API = import.meta.env.VITE_API_BASE_URL;

export default function AddBatch({ onClose, editData }) {
  const instituteDomain = localStorage.getItem("domain");

  const [form, setForm] = useState({
    course: "",
    subHeading: "",
    description: "",
    imageBase64: "",
    date: "",
    time: "",
    link: "",
  });

  const courses = [
    "Web Development",
    "Data Science",
    "UI / UX Design",
    "Mobile App Development",
    "Cloud Computing",
    "Cyber Security",
  ];

  useEffect(() => {
    if (editData) {
      setForm({
        course: editData.course || "",
        subHeading: editData.subHeading || "",
        description: editData.description || "",
        imageBase64: editData.image || "",
        date: editData.date || "",
        time: editData.time || "",
        link: editData.link || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          imageBase64: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editData
      ? `${API}/api/batches/${editData._id}`
      : `${API}/api/batches`;

    try {
      const res = await fetch(url, {
        method: editData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-domain": instituteDomain,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      onClose();
    } catch (err) {
      console.error("Save batch error:", err);
      alert("Error saving batch");
    }
  };

  return (
    <div className="addBatchContainer">
      <h2 className="addBatchTitle">
        {editData ? "Edit Batch" : "Add Batch"}
      </h2>

      <form onSubmit={handleSubmit} className="addBatchForm">
        <select name="course" value={form.course} onChange={handleChange} required>
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          name="subHeading"
          placeholder="Sub Heading"
          value={form.subHeading}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <input type="date" name="date" value={form.date} onChange={handleChange} />
        <input type="time" name="time" value={form.time} onChange={handleChange} />

        <input
          name="link"
          placeholder="Meeting / Registration Link"
          value={form.link}
          onChange={handleChange}
        />

        <div className="batchBtnRow">
          <button type="button" className="cancelBtn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="saveBtn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
