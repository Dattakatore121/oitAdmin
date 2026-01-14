import { useEffect, useState } from "react";
import AddBatch from "./AddBatch";
import "./NewBatch.css";

const API = import.meta.env.VITE_API_BASE_URL;

export default function NewBatch() {
  const [batches, setBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const domain = localStorage.getItem("domain");

  const fetchBatches = async () => {
    try {
      const res = await fetch(`${API}/api/batches`, {
        headers: {
          "x-domain": domain,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch batches");
        setBatches([]);
        return;
      }

      const data = await res.json();
      setBatches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setBatches([]);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const deleteBatch = async (id) => {
    if (!window.confirm("Delete this batch?")) return;

    try {
      const res = await fetch(`${API}/api/batches/${id}`, {
        method: "DELETE",
        headers: {
          "x-domain": domain,
        },
      });

      if (!res.ok) {
        console.error("Delete failed");
        return;
      }

      fetchBatches();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="newBatchContainer">
      <div className="newBatchHeader">
        <h2>New Batches</h2>
        <button
          className="addBatchBtn"
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
        >
          + Add Batch
        </button>
      </div>

      <div className="batchList">
        {batches.length === 0 && <p>Batches Loading...</p>}

        {batches.map((batch) => (
          <div key={batch._id} className="batchCard">
            <img
              src={batch.image || "https://via.placeholder.com/150"}
              alt={batch.subHeading}
              className="batchImage"
            />

            <div className="batchInfo">
              <div className="batchSub">{batch.subHeading}</div>
              <div className="batchDesc">{batch.description}</div>

              <div className="batchDateTime">
                <strong>Date:</strong> {batch.date} |{" "}
                <strong>Time:</strong> {batch.time}
              </div>

              {batch.link && (
                <a
                  href={batch.link}
                  target="_blank"
                  rel="noreferrer"
                  className="batchLink"
                >
                  {batch.link}
                </a>
              )}

              <div className="batchBtnRow">
                <button
                  className="editBtn"
                  onClick={() => {
                    setEditData(batch);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="deleteBtn"
                  onClick={() => deleteBatch(batch._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <button
              className="closeModal"
              onClick={() => {
                setShowModal(false);
                setEditData(null);
              }}
            >
              &times;
            </button>

            <AddBatch
              editData={editData}
              onClose={() => {
                setShowModal(false);
                setEditData(null);
                fetchBatches();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
