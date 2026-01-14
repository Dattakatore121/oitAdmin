import { useEffect, useState } from "react";
import "./TextReviews.css";

const API = `${import.meta.env.VITE_API_BASE_URL}/api/text-reviews`;

export default function TextReviews() {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      setReviews(result.data || []);
    } catch {
      alert("Failed to load reviews");
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchReviews();
  };

  if (!token) {
    return <p className="error">Unauthorized</p>;
  }

  return (
    <div className="reviews-page">
      <h2>Student Reviews</h2>

      {reviews.map((r) => (
        <div key={r._id} className="review-card">
          {/* Avatar */}
          <div className="avatar">
            {r.name.charAt(0).toUpperCase()}
          </div>

          <div className="review-body">
            <div className="review-header">
              <h4>{r.name}</h4>
              <span className="date">{r.date}</span>
            </div>

            {/* ⭐ Stars */}
            <div className="stars">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>

            <p>{r.description}</p>

            <button
              className="btn-delete"
              onClick={() => deleteReview(r._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
