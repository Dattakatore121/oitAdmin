import { useEffect, useState } from "react";
import axios from "axios";
import "./Blog.css";

const API = `${import.meta.env.VITE_API_BASE_URL}`;

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    content: "",
    publishedAt: "",
  });

  const domain = localStorage.getItem("domain");

  // ================= FETCH BLOGS =================
  const fetchBlogs = async () => {
    if (!domain) return;
    const res = await axios.get(`${API}/api/blogs`, {
      headers: { "x-domain": domain },
    });
    setBlogs(res.data || []);
  };

  useEffect(() => {
    fetchBlogs();
  }, [domain]);

  // ================= BASE64 =================
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageBase64 = null;
    if (imageFile) imageBase64 = await toBase64(imageFile);

    const data = {
      title: form.title,
      author: form.author,
      paragraphs: form.content.split("\n"),
      publishedAt: form.publishedAt,
      imageBase64,
    };

    const url = editId
      ? `${API}/api/blogs/${editId}`
      : `${API}/api/blogs`;

    await axios[editId ? "put" : "post"](url, data, {
      headers: { "x-domain": domain },
    });

    resetForm();
    fetchBlogs();
  };

  const handleEdit = (b) => {
    setEditId(b._id);
    setForm({
      title: b.title,
      author: b.author,
      content: b.paragraphs.join("\n"),
      publishedAt: b.publishedAt?.slice(0, 10),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    await axios.delete(`${API}/api/blogs/${id}`, {
      headers: { "x-domain": domain },
    });
    fetchBlogs();
  };

  const resetForm = () => {
    setEditId(null);
    setImageFile(null);
    setForm({ title: "", author: "", content: "", publishedAt: "" });
  };

  return (
    <div className="blog-container">
      <h2>Admin Blog Panel</h2>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="blog-form">
        <input
          placeholder="Title"
          value={form.title}
          required
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Author"
          value={form.author}
          required
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
        <input
          type="date"
          value={form.publishedAt}
          required
          onChange={(e) =>
            setForm({ ...form, publishedAt: e.target.value })
          }
        />
        <textarea
          rows="5"
          placeholder="Content"
          value={form.content}
          required
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <button type="submit">
          {editId ? "Update Blog" : "Save Blog"}
        </button>
      </form>

      {/* ================= BLOG LIST ================= */}
      <div className="blog-grid">
        {blogs.map((b) => (
          <div key={b._id} className="blog-card">
            <h4><b>Title : </b> {b.title}</h4>
            <p><b>Author : {b.author}</b></p>
            {b.image && <img src={b.image} alt="" />}
            <p><b>Content : </b>{b.paragraphs.slice(0, 2).join(" ")}...</p>

            <div className="blog-actions">
              <button onClick={() => setSelectedBlog(b)}>View</button>
              <button onClick={() => handleEdit(b)}>Edit</button>
              <button onClick={() => handleDelete(b._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL VIEW ================= */}
      {selectedBlog && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedBlog.title}</h2>
            <p><b>{selectedBlog.author}</b></p>
            <small>
              {new Date(selectedBlog.publishedAt).toLocaleDateString()}
            </small>

            {selectedBlog.image && (
              <img src={selectedBlog.image} alt="" />
            )}

            {selectedBlog.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            <button
              className="close-btn"
              onClick={() => setSelectedBlog(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
