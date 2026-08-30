"use client";

import React, { useState } from "react";
import { Car, Fuel, Gauge, Save, X, Compass } from "lucide-react";

export default function VehicleSetup({ onSave, onCancel }: { onSave?: () => void; onCancel?: () => void }) {
  const [formData, setFormData] = useState({
    brand: "Toyota",
    model: "Corolla",
    year: "2021",
    transmission: "Automatic",
    tankCapacity: "50",
    avgConsumption: "13.5",
    preferredFuel: "PMS (Petrol)",
    fuelType: "Petrol",
    drivingStyle: "Mixed Driving",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-900/60 border border-slate-800/80 rounded-[2.5rem] p-6 lg:p-8 backdrop-blur-xl shadow-2xl text-slate-100">
      
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
          <Car size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Vehicle Setup</h2>
          <p className="text-xs text-slate-400">Personalize your vehicle to get accurate AI range and savings forecasts.</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSave?.(); }} className="space-y-8 mt-6">
        
        {/* Section 1: Vehicle Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Car size={14} /> Vehicle Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="e.g. Toyota"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="e.g. Corolla"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="2021"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Transmission</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Fuel Type</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="Petrol">Petrol (PMS)</option>
                <option value="Diesel">Diesel (AGO)</option>
                <option value="Gas">Gas (LPG/CNG)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Fuel Information */}
        <div className="space-y-4 pt-4 border-t border-slate-800/60">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Fuel size={14} /> Fuel & Capacity Specs
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Tank Capacity (Liters)</label>
              <input
                type="number"
                name="tankCapacity"
                value={formData.tankCapacity}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Avg. Consumption (km/L)</label>
              <input
                type="number"
                step="0.1"
                name="avgConsumption"
                value={formData.avgConsumption}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Preferred Fuel Grade</label>
              <select
                name="preferredFuel"
                value={formData.preferredFuel}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="PMS (Petrol)">Standard Petrol</option>
                <option value="Premium Petrol">Premium Octane Petrol</option>
                <option value="Diesel">Standard Diesel</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Driving Preferences */}
        <div className="space-y-4 pt-4 border-t border-slate-800/60">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Compass size={14} /> Driving Preferences
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {["Mostly City Driving", "Mostly Highway", "Mixed Driving"].map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setFormData({ ...formData, drivingStyle: style })}
                className={`p-3 rounded-xl border text-center transition-all text-xs font-bold ${
                  formData.drivingStyle === style
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <X size={14} /> Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Save size={14} /> Save Vehicle Details
          </button>
        </div>

      </form>
    </div>
  );
}
