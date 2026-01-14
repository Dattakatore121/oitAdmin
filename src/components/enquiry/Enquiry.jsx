import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Enquiry.css";

const API = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API}/api/enquiries`;

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState(""); // 🔹 Name search
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch all enquiries
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, axiosConfig);
      setEnquiries(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Unauthorized / Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Delete enquiry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, axiosConfig);
      fetchEnquiries();
    } catch (error) {
      alert("Delete failed / Unauthorized");
    }
  };

  // Filter enquiries by name
  const filteredEnquiries = (enquiries || []).filter((e) => {
    const fullName = `${e.firstName || ""} ${e.lastName || ""}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="contact-page">
      <h2 className="page-title">📩 Enquiries</h2>

      {/* 🔹 Search by Name */}
      <div className="filter-box">
        <input
          type="text"
          className="search-input"
          placeholder="Search by Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Course</th>
                {/* <th>Domain</th> */}
                <th>Message</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    No enquiries found
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((c, index) => (
                  <tr key={c._id}>
                    <td>{index + 1}</td>
                    <td>{c.firstName} {c.lastName}</td>
                    <td>{c.phone}</td>
                    <td>{c.email}</td>
                    <td>{c.course}</td>
                    {/* <td>{c.domain}</td> */}
                    <td>{c.message}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(c._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Enquiry;
