'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import Sidebar from '@/app/components/Sidebar';
import carData from '@/data/car_brands_models.json';

const stations = [
  'NNPC', 'Total', 'TotalEnergies', 'Oando', 'MRS', 'Conoil',
  'Enyo', 'Ardova', 'Mobil', 'Rainoil', 'Eterna', 'NorthWest Petroleum',
  'Heyden', 'AA Rano', 'Forte Oil', 'Nipco', 'Acorn', 'Ammasco', 'Petrocam'
];

// Simulated station coordinates per brand (Replace with API/DB in real app)
const stationLocations: Record<string, google.maps.LatLngLiteral[]> = {
  NNPC: [
    { lat: 6.5244, lng: 3.3792 },
    { lat: 6.5308, lng: 3.3912 },
  ],
  Total: [
    { lat: 6.5271, lng: 3.3762 },
    { lat: 6.5329, lng: 3.3888 },
  ],
  Oando: [
    { lat: 6.528, lng: 3.38 },
    { lat: 6.534, lng: 3.392 },
  ],
  // Add others...
};

export default function FuelMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedStation, setSelectedStation] = useState('');

  const brands = Object.keys(carData);
  const models =
    selectedBrand && selectedBrand in carData
      ? carData[selectedBrand as keyof typeof carData]
      : [];

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 6.535, lng: 3.384 },
        zoom: 13,
      });

      mapInstance.current = map;
    });
  }, []);

  // Re-render markers whenever stations, selectedStation, selectedAreaLocation, or userLocation changes
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (selectedStation && stationLocations[selectedStation]) {
      const locations = stationLocations[selectedStation];

      locations.forEach((location, index) => {
        const marker = new google.maps.Marker({
          position: location,
          map: mapInstance.current!,
          title: `${selectedStation} Station ${index + 1}`,
        });

        const infowindow = new google.maps.InfoWindow({
          content: `<div style="font-family: sans-serif;">
            <strong>${selectedStation} Station ${index + 1}</strong><br/>
            ₦${600 + index * 10} / litre<br/>
            <button style='background: #4285F4; color: white; padding: 6px 12px; border: none; border-radius: 4px; margin-top: 8px;'>Directions</button>
          </div>`,
        });

        marker.addListener('click', () => {
          infowindow.open(mapInstance.current!, marker);
        });

        markersRef.current.push(marker);
      });

      // Center on the first location
      mapInstance.current.setCenter(locations[0]);
    }
  }, [selectedStation]);

  return (
    <main className="flex min-h-screen bg-gray-100 text-gray-800 relative">
      <Sidebar
        brands={brands}
        models={models}
        stations={stations.map((s) => s.name)} // Sidebar only needs names
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
      />
      <main className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
      </main>
    </div>
  );
}
