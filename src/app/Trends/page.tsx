"use client";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

const allData = [
  { station: "NNPC", location: "Lagos", fuelType: "Petrol", prices: [600, 640, 610, 750] },
  { station: "Total", location: "Abuja", fuelType: "Diesel", prices: [800, 820, 790, 810] },
  { station: "Oando", location: "Port Harcourt", fuelType: "Gas", prices: [400, 420, 410, 430] },
];

export default function TrendsPage() {
  const [station, setStation] = useState("");
  const [location, setLocation] = useState("");
  const [fuelType, setFuelType] = useState("");

  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: ["4 weeks ago", "3 weeks ago", "2 weeks ago", "1 week ago"],
    datasets: [
      {
        label: "Fuel Price",
        data: [],
        borderColor: "#064E3B",
        backgroundColor: "#064E3B",
        tension: 0.3,
      },
    ],
  });

  // Automatically update chart when filters change
  useEffect(() => {
    const filtered = allData.find(
      (item) =>
        (station ? item.station === station : true) &&
        (location ? item.location === location : true) &&
        (fuelType ? item.fuelType === fuelType : true)
    );

    if (filtered) {
      setChartData({
        labels: ["4 weeks ago", "3 weeks ago", "2 weeks ago", "1 week ago"],
        datasets: [
          {
            label: `${filtered.station} - ${filtered.fuelType}`,
            data: filtered.prices,
            borderColor: "#064E3B",
            backgroundColor: "#064E3B",
            tension: 0.3,
          },
        ],
      });
    } else {
      // Clear chart if no match
      setChartData({
        labels: ["4 weeks ago", "3 weeks ago", "2 weeks ago", "1 week ago"],
        datasets: [
          {
            label: "Fuel Price",
            data: [],
            borderColor: "#ccc",
            backgroundColor: "#ccc",
            tension: 0.3,
          },
        ],
      });
    }
  }, [station, location, fuelType]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: { legend: { display: true } },
  };

  return (
   <>
   <Navbar/>
   <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Fuel Price Trends</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 justify-center mb-6">
          <select
            value={station}
            onChange={(e) => setStation(e.target.value)}
            className="border-2 border-green-700 bg-green-50 text-green-900 font-medium rounded-lg p-3 w-full md:w-48 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="">Fuel Station</option>
            <option value="NNPC">NNPC</option>
            <option value="Total">Total</option>
            <option value="Oando">Oando</option>
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-2 border-green-700 bg-green-50 text-green-900 font-medium rounded-lg p-3 w-full md:w-48 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="">City</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
            <option value="Port Harcourt">Port Harcourt</option>
          </select>

          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="border-2 border-green-700 bg-green-50 text-green-900 font-medium rounded-lg p-3 w-full md:w-48 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="">Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Gas">Gas</option>
          </select>
        </div>

        {/* Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
   </>
  );
}
