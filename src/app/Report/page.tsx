"use client";

import { useState } from "react";
import { Upload, Fuel } from "lucide-react";
import Navbar from "../components/Navbar";
import { fuelStations } from "@/app/stationData"; // ✅ Import JSON

export default function ReportPage() {
  const [station, setStation] = useState("");
  const [address, setAddress] = useState("Ajah, Lekki, Lagos");
  const [fuelType, setFuelType] = useState("PMS");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [comments, setComments] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ station, address, fuelType, price, photo, comments });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-green-900 mb-8 flex items-center gap-2">
            <Fuel size={32} /> Report Fuel Price
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Station */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Station
              </label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none text-black"
              >
                <option value="">-- Select Station --</option>
                {fuelStations.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none text-black"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fuel Type
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none text-black"
              >
                <option value="PMS">PMS</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price per Litre
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none text-black"
                placeholder="e.g. 620.50"
              />
            </div>

            {/* Upload Photo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Photo
              </label>
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
              >
                <Upload className="text-gray-500 mb-2" size={24} />
                <span className="text-gray-600">
                  {photo ? photo.name : "Click to upload or drag & drop"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
              </label>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Comments
              </label>
              <textarea
                placeholder="Optional"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none text-black"
                rows={3}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-800 transition"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
