'use client';

import { useEffect } from 'react';

interface SidebarProps {
  brands: string[];
  models: string[];
  stations: string[];  // array of station names as strings
  selectedBrand: string;
  setSelectedBrand: React.Dispatch<React.SetStateAction<Brand | "">>;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  selectedStation: string;
  setSelectedStation: (value: string) => void;
  locationValue: string;
  setLocationValue: (value: string) => void;
}

export default function Sidebar({
  brands,
  models,
  stations,
  selectedBrand,
  setSelectedBrand,
  selectedModel,
  setSelectedModel,
  selectedStation,
  setSelectedStation,
  locationValue,
  setLocationValue,
}: SidebarProps) {
  useEffect(() => {
    const input = document.getElementById("areaSearch") as HTMLInputElement;

    if (!input || !window.google) return;

    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ["(regions)"],
      componentRestrictions: { country: "ng" },
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;

      if (location) {
        const lat = location.lat();
        const lng = location.lng();
        console.log("Selected Area:", place.name, lat, lng);

        if (place.name) {
          setLocationValue(place.name);
        }
      }
    });
  }, [setLocationValue]);

  return (
    <aside className="w-[300px] bg-[#102542] text-white p-4 space-y-6">
      {/* Car Brand Selection */}
      <div>
        <label className="block mb-1">Select Car Brand</label>
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedModel(''); // reset model on brand change
          }}
          className="w-full p-2 text-black rounded"
        >
          <option value="">-- Choose Brand --</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Car Model Selection */}
      <div>
        <label className="block mb-1">Select Model</label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-2 text-black rounded"
          disabled={!selectedBrand}
        >
          <option value="">-- Choose Model --</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* Fuel Station Selection */}
      <div>
        <label className="block mb-1">Select Fuel Station</label>
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className="w-full p-2 text-black rounded"
        >
          <option value="">-- Choose Station --</option>
          {stations.map((station, index) => (
            <option key={`${station}-${index}`} value={station}>
              {station}
            </option>
          ))}
        </select>
      </div>

      {/* Area Search Input */}
      <div>
        <label className="block mb-1">Search Area</label>
        <input
          id="areaSearch"
          type="text"
          placeholder="Search Lagos Area (e.g., Lekki)"
          value={locationValue}
          onChange={(e) => setLocationValue(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>
    </aside>
  );
}
