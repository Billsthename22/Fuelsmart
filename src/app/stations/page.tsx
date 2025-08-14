/// <reference types="@types/google.maps" />

"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import carData from "@/data/car_brands_models.json";
import { fuelStations } from "@/app/stationData";

interface Station {
  name: string;
  price: number;
  location: google.maps.LatLngLiteral;
}

type Brand = keyof typeof carData;

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  version: "weekly",
  libraries: ["places"],
});

export default function FuelMapPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [stations, setStations] = useState<Station[]>([]);
  const [brands] = useState<string[]>(Object.keys(carData));
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<Brand | "">("");
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedStationData, setSelectedStationData] = useState<Station | null>(null);
  const [selectedAreaLocation, setSelectedAreaLocation] = useState<google.maps.LatLngLiteral | null>(null);

  const mapInstance = useRef<google.maps.Map | null>(null);
  const infoWindowInstance = useRef<google.maps.InfoWindow | null>(null);
  const directionsServiceInstance = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererInstance = useRef<google.maps.DirectionsRenderer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const geocodeStations = (names: string[]) => {
    return loader.load().then(() => {
      const geocoder = new google.maps.Geocoder();

      const promises = names.map(
        (stationName) =>
          new Promise<Station | null>((resolve) => {
            geocoder.geocode({ address: stationName + ", Nigeria" }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                const loc = results[0].geometry.location;
                resolve({
                  name: stationName,
                  price: Math.floor(Math.random() * 300) + 200,
                  location: { lat: loc.lat(), lng: loc.lng() },
                });
              } else {
                console.warn(`Geocode failed for station: ${stationName}`, status);
                resolve(null);
              }
            });
          })
      );

      return Promise.all(promises).then((results) => results.filter((r): r is Station => r !== null));
    });
  };

  useEffect(() => {
    if (fuelStations.length === 0) return;

    geocodeStations(fuelStations).then(setStations);
  }, []);

  const getDistanceInKm = (loc1: google.maps.LatLngLiteral, loc2: google.maps.LatLngLiteral) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLon = toRad(loc2.lng - loc1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(loc1.lat)) *
        Math.cos(toRad(loc2.lat)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    loader.load().then(() => {
      if (!google?.maps || !mapRef.current) {
        console.error("Google Maps not loaded");
        return;
      }

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 6.5244, lng: 3.3792 },
        zoom: 11,
      });

      const infoWindow = new google.maps.InfoWindow();
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      mapInstance.current = map;
      infoWindowInstance.current = infoWindow;
      directionsServiceInstance.current = directionsService;
      directionsRendererInstance.current = directionsRenderer;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const position = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            setUserLocation(position);
            map.setCenter(position);

            new google.maps.Marker({
              position,
              map,
              icon: { url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" },
              title: "Your Location",
            });

            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: position }, (results, status) => {
              if (status === "OK" && results && results.length > 0) {
                const areaName =
                  results[0].address_components.find(
                    (c) =>
                      c.types.includes("sublocality") || c.types.includes("locality")
                  )?.long_name || "";
                setSelectedArea(areaName);
                setSelectedAreaLocation(position);
              }
            });
          },
          () => console.warn("Geolocation not allowed.")
        );
      }

      if (inputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ["geometry", "name"],
          componentRestrictions: { country: "ng" },
          types: ["(regions)"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const loc = place.geometry?.location;
          if (!loc) return;

          const location = { lat: loc.lat(), lng: loc.lng() };
          setUserLocation(location);
          setSelectedArea(place.name || "");
          setSelectedAreaLocation(location);
          map.setCenter(location);
          map.setZoom(14);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!mapInstance.current || stations.length === 0) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const filteredStations = stations.filter((station) => {
      const nameMatch = selectedStation ? station.name === selectedStation : true;
      const areaMatch =
        selectedAreaLocation && station.location
          ? getDistanceInKm(selectedAreaLocation, station.location) <= 20
          : true;

      return nameMatch && areaMatch;
    });

    filteredStations.forEach((station) => {
      const marker = new google.maps.Marker({
        position: station.location,
        map: mapInstance.current!,
        title: `${station.name} - ₦${station.price}`,
      });

      marker.addListener("click", () => {
        infoWindowInstance.current?.setContent(`
          <div>
            <strong>${station.name}</strong><br />
            ₦${station.price} per litre<br />
            <button id="dir-btn" style="color:blue;cursor:pointer" ${!userLocation ? "disabled" : ""}>
              Get Directions
            </button>
          </div>
        `);
        infoWindowInstance.current?.open(mapInstance.current!, marker);

        google.maps.event.addListenerOnce(infoWindowInstance.current!, "domready", () => {
          const btn = document.getElementById("dir-btn");
          if (
            btn &&
            userLocation?.lat !== undefined &&
            userLocation?.lng !== undefined
          ) {
            btn.onclick = null;
            btn.addEventListener("click", () => {
              directionsServiceInstance.current?.route(
                {
                  origin: userLocation,
                  destination: station.location,
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                  if (status === "OK" && result) {
                    directionsRendererInstance.current?.setDirections(result);
                  } else {
                    console.error("Directions request failed:", status);
                  }
                }
              );
            });
          }
        });

        setSelectedStationData(station);
      });

      markersRef.current.push(marker);
    });

    new MarkerClusterer({ markers: markersRef.current, map: mapInstance.current });
  }, [stations, selectedStation, selectedAreaLocation, userLocation]);

  useEffect(() => {
    if (selectedBrand && carData[selectedBrand]) {
      setModels(carData[selectedBrand]);
    } else {
      setModels([]);
    }
    setSelectedModel("");
  }, [selectedBrand]);

  const handleAreaChange = (areaName: string) => {
    setSelectedArea(areaName);

    if (!areaName) {
      setSelectedAreaLocation(null);
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: areaName + ", Nigeria" }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const loc = results[0].geometry.location;
        setSelectedAreaLocation({ lat: loc.lat(), lng: loc.lng() });
      } else {
        setSelectedAreaLocation(null);
      }
    });
  };

  return (
    <main className="flex min-h-screen bg-gray-100 text-gray-800 relative">
      <Sidebar
        brands={brands}
        models={models}
        stations={stations.map((s) => s.name)}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
        locationValue={selectedArea}
        setLocationValue={handleAreaChange}
      />

      <div className="flex-1 relative">
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 bg-white rounded-full p-1 shadow-md"
          aria-label="Go back"
        >
          <ChevronLeft className="w-8 h-8 text-gray-600 hover:text-gray-900" />
        </Link>

        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search your location"
            className="w-[300px] px-4 py-2 rounded-md shadow-md border border-gray-300"
            value={selectedArea}
            onChange={(e) => handleAreaChange(e.target.value)}
          />
        </div>

        <div ref={mapRef} className="w-full h-screen" />

        {selectedStationData && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-10 w-[300px] text-center">
            <h2 className="text-lg font-bold">{selectedStationData.name}</h2>
            <p className="text-sm">₦{selectedStationData.price} per litre</p>
          </div>
        )}
      </div>
    </main>
  );
}
