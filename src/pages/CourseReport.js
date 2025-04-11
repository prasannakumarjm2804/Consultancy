import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "../styles/CourseReport.css";
import AdminLayout from "../components/AdminLayout";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsPage = () => {
  const [reportType, setReportType] = useState("day");
  const [reportData, setReportData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [noDataMessage, setNoDataMessage] = useState("");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleYearChange = (e) => setSelectedYear(parseInt(e.target.value, 10));

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-");
    setSelectedMonth(parseInt(month, 10)); // Convert month to number (1-12)
    setSelectedYear(parseInt(year, 10)); // Ensure year updates correctly
  };

  const generateReport = async () => {
    try {
      let queryParams = `reportType=${reportType}&courseId=${selectedCourse}`;
      
      if (reportType === "day") {
        queryParams += `&startDate=${startDate}&endDate=${endDate}`;
      } else if (reportType === "month") {
        queryParams += `&month=${selectedMonth}&year=${selectedYear}`;
      } else if (reportType === "year") {
        queryParams += `&year=${selectedYear}`;
      }

      console.log("API Request URL:", `http://localhost:5000/reports?${queryParams}`);

      const response = await axios.get(`http://localhost:5000/reports?${queryParams}`);
      const formattedData = response.data.flatMap((entry) => entry.users);

      if (formattedData.length === 0) {
        setNoDataMessage("No data found for the selected period.");
        setChartData(null);
      } else {
        setNoDataMessage("");
        setChartData(formatChartData(formattedData));
      }

      setReportData(formattedData);
    } catch (error) {
      console.error("Error generating report:", error.response?.data || error.message);
    }
  };

  const formatChartData = (data) => {
    let labels = [];
    let counts = {};

    if (reportType === "day") {
      labels = data.map((item) => new Date(item.date).toLocaleDateString());
      counts = data.reduce((acc, item) => {
        const date = new Date(item.date).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
    } else if (reportType === "month") {
      labels = data.map((item) => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
      });
      counts = data.reduce((acc, item) => {
        const date = new Date(item.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
        return acc;
      }, {});
    } else if (reportType === "year") {
      labels = data.map((item) => new Date(item.date).getFullYear().toString());
      counts = data.reduce((acc, item) => {
        const year = new Date(item.date).getFullYear().toString();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {});
    }

    return {
      labels: [...new Set(labels)], // Ensure unique labels
      datasets: [
        {
          label: "Number of Enrollments",
          data: Object.values(counts),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    let title = "Enrollment Report";
    let subtitle = "";
  
    if (reportType === "day") {
      title = "Daily Enrollment Report";
      subtitle = `From: ${startDate} To: ${endDate}`;
    } else if (reportType === "month") {
      title = "Monthly Enrollment Report";
      subtitle = `Month: ${selectedMonth} / Year: ${selectedYear}`;
    } else if (reportType === "year") {
      title = "Yearly Enrollment Report";
      subtitle = `Year: ${selectedYear}`;
    }
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(12);
    doc.text(subtitle, 14, 25);
  
    let tableHeaders = ["Name", "Email", "Course", "Enrolled Date"];
    if (reportType === "month") {
      tableHeaders = ["Month", "Year", "Name", "Email", "Course", "Enrolled Date"];
    } else if (reportType === "year") {
      tableHeaders = ["Year", "Name", "Email", "Course", "Enrolled Date"];
    }
  
    const tableData = reportData.map((user) => {
      if (reportType === "day") {
        return [user.name, user.email, user.course, new Date(user.date).toLocaleDateString()];
      } else if (reportType === "month") {
        return [selectedMonth, selectedYear, user.name, user.email, user.course, new Date(user.date).toLocaleDateString()];
      } else if (reportType === "year") {
        return [selectedYear, user.name, user.email, user.course, new Date(user.date).toLocaleDateString()];
      }
    });
  
    autoTable(doc, {
      startY: 35,
      head: [tableHeaders],
      body: tableData,
    });
  
    doc.save(`${reportType}_report.pdf`);
  };
  
  return (
    <AdminLayout>
      <div className="reports-container">
        <h1>Generate Reports</h1>
        <div className="report-options">
          <label>
            <input type="radio" value="day" checked={reportType === "day"} onChange={handleReportTypeChange} />
            Day Wise
          </label>
          <label>
            <input type="radio" value="month" checked={reportType === "month"} onChange={handleReportTypeChange} />
            Month Wise
          </label>
          <label>
            <input type="radio" value="year" checked={reportType === "year"} onChange={handleReportTypeChange} />
            Year Wise
          </label>
        </div>

        <div className="course-selection">
          <label>
            Select Course:
            <select value={selectedCourse} onChange={handleCourseChange}>
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {reportType === "day" && (
          <div className="date-selection">
            <label>
              Start Date:
              <input type="date" value={startDate} onChange={handleStartDateChange} />
            </label>
            <label>
              End Date:
              <input type="date" value={endDate} onChange={handleEndDateChange} />
            </label>
          </div>
        )}

        {reportType === "month" && (
          <div className="month-selection">
            <label>
              Select Month:
              <input type="month" onChange={handleMonthChange} />
            </label>
            <label>
              Year:
              <input type="number" value={selectedYear} onChange={handleYearChange} min="2000" max={new Date().getFullYear()} />
            </label>
          </div>
        )}

        {reportType === "year" && (
          <div className="year-selection">
            <label>
              Select Year:
              <input type="number" value={selectedYear} onChange={handleYearChange} min="2000" max={new Date().getFullYear()} />
            </label>
          </div>
        )}

        <button onClick={generateReport}>Generate Report</button>
        
        {noDataMessage && <p className="no-data-message">{noDataMessage}</p>}

        {reportData.length > 0 && (
          <div className="report-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Date Registered</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.course}</td>
                    <td>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={downloadPDF}>Download PDF</button>
          </div>
        )}

        {chartData && (
          <div className="chart-container">
            <h2>Enrollment Data Visualization</h2>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: reportType === "day" ? "Date" : reportType === "month" ? "Month/Year" : "Year",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Number of Enrollments",
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;
