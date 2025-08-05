import React, { useEffect, useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const AdminDashboardCharts = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/admin/dashboard-stats")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  const barData = {
    labels: data.sitePopularity.map((d) => d.name),
    datasets: [
      {
        label: "Most Booked Sites",
        data: data.sitePopularity.map((d) => d.bookings),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const doughnutData = {
    labels: data.operatorStats.map((d) => d.fullname),
    datasets: [
      {
        label: "Operator Activity Count",
        data: data.operatorStats.map((d) => d.total_activities),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const lineData = {
    labels: data.userEngagement.map((d) => d.date),
    datasets: [
      {
        label: "Bookings per Day",
        data: data.userEngagement.map((d) => d.count),
        fill: false,
        borderColor: "#36A2EB",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-4 grid gap-6 md:grid-cols-2">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Top Tourist Sites</h2>
        <Bar data={barData} />
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Operator Stats</h2>
        <Doughnut data={doughnutData} />
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow col-span-2">
        <h2 className="text-xl font-semibold mb-2">Bookings Over Time</h2>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default AdminDashboardCharts;
