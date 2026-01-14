import { useEffect, useState } from "react";
import "./VideoReviews.css";

const API = `${import.meta.env.VITE_API_BASE_URL}/api/video-reviews`;

export default function VideoReviews() {
  const [videos, setVideos] = useState([]);
  const [iframe, setIframe] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      setVideos(result.data || []);
    } catch (err) {
      alert("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  const addVideo = async () => {
    if (!iframe.trim()) {
      return alert("Please paste YouTube iframe code");
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ iframe }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Add failed");
      }

      setIframe("");
      setShowForm(false);
      fetchVideos();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteVideo = async (id) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchVideos();
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (!token) {
    return <p className="error">Unauthorized – Please login</p>;
  }

  return (
    <div className="video-reviews">
      <h2>Video Reviews</h2>

      {/* Add Button */}
      <button className="btn-add" onClick={() => setShowForm(!showForm)}>
        ➕ Add Video
      </button>

      {/* Add Video Form */}
      {showForm && (
        <div className="add-form">
          <textarea
            placeholder="Paste YouTube iframe embed code here..."
            value={iframe}
            onChange={(e) => setIframe(e.target.value)}
          />
          <button onClick={addVideo}>Save</button>
        </div>
      )}

      {/* Videos Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : videos.length === 0 ? (
        <p>No video reviews added yet.</p>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <div key={video._id} className="video-card">
              <div
                className="iframe-box"
                dangerouslySetInnerHTML={{ __html: video.iframe }}
              />
              <button
                className="btn-delete"
                onClick={() => deleteVideo(video._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
