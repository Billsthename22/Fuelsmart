'use client';

interface SidebarProps {
  brands: string[];
  models: string[];
  stations: string[];
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  selectedStation: string;
  setSelectedStation: (value: string) => void;
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
}: SidebarProps) {
  return (
    <aside className="w-[300px] bg-[#102542] text-white p-4 space-y-6">
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

      <div>
        <label className="block mb-1">Select Fuel Station</label>
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className="w-full p-2 text-black rounded"
        >
          <option value="">-- Choose Station --</option>
          {stations.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
