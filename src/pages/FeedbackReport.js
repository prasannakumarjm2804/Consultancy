import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Bar,
  Pie,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import AdminLayout from "../components/AdminLayout";
import "../styles/FeedbackReport.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const FeedbackReport = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [month, setMonth] = useState("");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/reviews")
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error("Failed to fetch feedbacks", err));
  }, []);

  useEffect(() => {
    if (!month && !topic) {
      setFilteredFeedbacks(feedbacks);
    } else {
      const filtered = feedbacks.filter((f) => {
        const date = new Date(f.createdAt);
        const monthMatch = !month || date.getMonth() + 1 === parseInt(month);
        const topicMatch = !topic || f.topic === topic;
        return monthMatch && topicMatch;
      });
      setFilteredFeedbacks(filtered);
    }
  }, [month, topic, feedbacks]);

  const positiveFeedbacks = filteredFeedbacks.filter((f) => f.rating >= 4);
  const negativeFeedbacks = filteredFeedbacks.filter((f) => f.rating < 4);

  const pieData = {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        label: "Feedback Analysis",
        data: [positiveFeedbacks.length, negativeFeedbacks.length],
        backgroundColor: ["#81c784", "#e57373"],
      },
    ],
  };

  const barData = {
    labels: ["1★", "2★", "3★", "4★", "5★"],
    datasets: [
      {
        label: "Rating Count",
        data: [
          filteredFeedbacks.filter((f) => f.rating === 1).length,
          filteredFeedbacks.filter((f) => f.rating === 2).length,
          filteredFeedbacks.filter((f) => f.rating === 3).length,
          filteredFeedbacks.filter((f) => f.rating === 4).length,
          filteredFeedbacks.filter((f) => f.rating === 5).length,
        ],
        backgroundColor: "#64b5f6",
      },
    ],
  };

  return (
    <AdminLayout>
      <div className="feedback-report-container">
        <h2>Feedback Analysis Report</h2>

        <div className="filters">
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">Select Month</option>
            {[...Array(12)].map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {new Date(0, idx).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">Select Topic</option>
            <option value="Course">Course</option>
            <option value="MarketPlace">MarketPlace</option>
            <option value="Fabrics">Fabrics</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="charts-container">
          <div className="chart-box">
            <h4>Positive vs Negative Feedback</h4>
            <Pie data={pieData} />
          </div>
          <div className="chart-box">
            <h4>Ratings Breakdown</h4>
            <Bar data={barData} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FeedbackReport;
