import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

const API = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [batchCount, setBatchCount] = useState(0);
  const [placementCount, setPlacementCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [careerCount, setCareerCount] = useState(0);

  const domain = localStorage.getItem("domain");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!domain || !token) return;
    fetchBatchCount();
    fetchPlacementCount();
    fetchEnquiryCount();
    fetchCareerCount();
  }, [domain, token]);

  const fetchBatchCount = async () => {
    try {
      const res = await fetch(`${API}/api/batches`, { headers: { "x-domain": domain } });
      const data = await res.json();
      setBatchCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error(err);
      setBatchCount(0);
    }
  };

  const fetchPlacementCount = async () => {
    try {
      const res = await fetch(`${API}/api/placements`, { headers: { "x-domain": domain } });
      const data = await res.json();
      setPlacementCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error(err);
      setPlacementCount(0);
    }
  };

  const fetchEnquiryCount = async () => {
    try {
      const res = await fetch(`${API}/api/enquiries`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setEnquiryCount(data?.count ?? data?.data?.length ?? 0);
    } catch (err) {
      console.error(err);
      setEnquiryCount(0);
    }
  };

  const fetchCareerCount = async () => {
    try {
      const res = await fetch(`${API}/api/careers`, { headers: { Authorization: `Bearer ${token}`, domain } });
      const data = await res.json();
      setCareerCount(Array.isArray(data?.data) ? data.data.length : 0);
    } catch (err) {
      console.error(err);
      setCareerCount(0);
    }
  };

  // Vertical Bar chart data
  const barChartData = {
    labels: ["Batches", "Careers", "Enquiries", "Placements"],
    datasets: [
      {
        label: "Count",
        data: [batchCount, careerCount, enquiryCount, placementCount],
        backgroundColor: [
          "rgba(16, 185, 129, 0.6)",
          "rgba(250, 204, 21, 0.6)",
          "rgba(239, 68, 68, 0.6)",
          "rgba(99, 102, 241, 0.6)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(250, 204, 21, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(99, 102, 241, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    indexAxis: 'x', // vertical bars
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',     // top of bar
        align: 'end',      // number on top
        color: '#1e293b',
        font: { weight: 'bold', size: 14 },
      },
    },
    scales: {
      y: { beginAtZero: true },
      x: { ticks: { font: { size: 14 } } },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome to Admin Dashboard</p>

      <div className="stats-grid">
        {/* <div className="stat-card"><h3>Users</h3><p className="stat-value">1,248</p></div> */}
        <div className="stat-card"><h3>Batches</h3><p className="stat-value">{batchCount}</p></div>
        <div className="stat-card"><h3>Careers</h3><p className="stat-value">{careerCount}</p></div>
        <div className="stat-card"><h3>Enquiries</h3><p className="stat-value">{enquiryCount}</p></div>
        <div className="stat-card"><h3>Placements</h3><p className="stat-value">{placementCount}</p></div>
      </div>

      <div className="chart-card">
        <h2>Overview</h2>
        <Bar data={barChartData} options={barChartOptions} />
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>New batch created</li>
          <li>New career opening added</li>
          <li>New enquiries received</li>
          <li>Placement report updated</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
