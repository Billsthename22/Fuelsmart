'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import Sidebar from '@/app/components/Sidebar'
import carData from '@/data/car_brands_models.json'

const stations = [
  'NNPC', 'Total', 'TotalEnergies', 'Oando', 'MRS', 'Conoil',
  'Enyo', 'Ardova', 'Mobil', 'Rainoil', 'Eterna', 'NorthWest Petroleum',
  'Heyden', 'AA Rano', 'Forte Oil', 'Nipco', 'Acorn', 'Ammasco', 'Petrocam'
]

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
}

type MarkerBundle = {
  marker: google.maps.marker.AdvancedMarkerElement
  info: google.maps.InfoWindow
  position: google.maps.LatLngLiteral
}

export default function FuelMapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markerBundlesRef = useRef<MarkerBundle[]>([])
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const activeInfoRef = useRef<google.maps.InfoWindow | null>(null)

  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedStation, setSelectedStation] = useState('')
  const [userPos, setUserPos] = useState<google.maps.LatLngLiteral | null>(null)
  const [mapsReady, setMapsReady] = useState(false)

  const brands = Object.keys(carData)
  const models =
    selectedBrand && selectedBrand in carData
      ? carData[selectedBrand as keyof typeof carData]
      : []

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
      libraries: ['marker'],
    })

    loader.load().then(() => {
      if (!mapRef.current) return

      const fallbackCenter = { lat: 6.535, lng: 3.384 }
      const map = new google.maps.Map(mapRef.current, {
        center: fallbackCenter,
        zoom: 13,
      })
      mapInstance.current = map
      setMapsReady(true)

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            setUserPos(p)
            map.setCenter(p)
            map.setZoom(14)
            placeOrUpdateUserMarker(p)
          },
          () => {},
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        )
      }
    })
  }, [])

  useEffect(() => {
    if (!mapsReady || !mapInstance.current || !userPos) return
    placeOrUpdateUserMarker(userPos)
  }, [userPos, mapsReady])

  useEffect(() => {
    if (!mapsReady || !mapInstance.current) return

    clearStationMarkers()

    if (!selectedStation || !stationLocations[selectedStation]) return
    const map = mapInstance.current
    const locations = stationLocations[selectedStation]

    locations.forEach((location, index) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: location,
        title: `${selectedStation} Station ${index + 1}`,
      })

      const distText = userPos
        ? `${haversineKm(userPos, location).toFixed(1)} km`
        : 'distance unknown'

      const dirUrl =
        `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}&travelmode=driving`

      const info = new google.maps.InfoWindow({
        content: `
          <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
            <strong>${selectedStation} Station ${index + 1}</strong><br/>
            ₦${600 + index * 10} per litre<br/>
            ${distText} from you<br/>
            <a href="${dirUrl}" target="_blank" rel="noopener"
               style="display:inline-block;background:#1a73e8;color:white;padding:6px 12px;border-radius:4px;margin-top:8px;text-decoration:none">
              Directions
            </a>
          </div>`,
      })

      marker.addListener('gmp-click', () => {
        activeInfoRef.current?.close()
        info.open({ map, anchor: marker })
        activeInfoRef.current = info
      })

      markerBundlesRef.current.push({ marker, info, position: location })
    })

    // Focus nearest on brand change too
    focusNearestStation()
  }, [selectedStation, mapsReady, userPos])

  function focusNearestStation() {
    if (!mapInstance.current) return
    if (!selectedStation) return
    if (markerBundlesRef.current.length === 0) return

    const map = mapInstance.current

    // pick nearest to user if available, else first
    let idx = 0
    if (userPos) {
      const dists = markerBundlesRef.current.map(b => haversineKm(userPos, b.position))
      idx = argMinIndex(dists)
    }
    const bundle = markerBundlesRef.current[idx]

    activeInfoRef.current?.close()
    bundle.info.open({ map, anchor: bundle.marker })
    activeInfoRef.current = bundle.info
    map.setCenter(bundle.position)
    map.setZoom(15)
  }

  function placeOrUpdateUserMarker(p: google.maps.LatLngLiteral) {
    if (!mapInstance.current) return
    const map = mapInstance.current

    const content = document.createElement('div')
    content.style.width = '14px'
    content.style.height = '14px'
    content.style.borderRadius = '50%'
    content.style.background = '#1a73e8'
    content.style.boxShadow = '0 0 0 3px #ffffff'

    if (!userMarkerRef.current) {
      userMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: p,
        title: 'Your location',
        content,
      })
    } else {
      userMarkerRef.current.position = p
    }
  }

  function clearStationMarkers() {
    markerBundlesRef.current.forEach(b => (b.marker.map = null))
    markerBundlesRef.current = []
    activeInfoRef.current?.close()
    activeInfoRef.current = null
  }

  function haversineKm(a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral) {
    const R = 6371
    const dLat = toRad(b.lat - a.lat)
    const dLng = toRad(b.lng - a.lng)
    const lat1 = toRad(a.lat)
    const lat2 = toRad(b.lat)
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
    return 2 * R * Math.asin(Math.sqrt(h))
  }

  function toRad(x: number) {
    return x * Math.PI / 180
  }

  function argMinIndex(nums: number[]) {
    let idx = 0
    let best = nums[0]
    for (let i = 1; i < nums.length; i++) {
      if (nums[i] < best) {
        best = nums[i]
        idx = i
      }
    }
    return idx
  }

  // Now centers on nearest station for the selected brand
  function locateSelectedStation() {
    if (!selectedStation) return
    if (!mapInstance.current) return

    // refresh user position, then focus
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserPos(p)
          placeOrUpdateUserMarker(p)
          focusNearestStation()
        },
        () => {
          // fallback to last known userPos
          focusNearestStation()
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    } else {
      focusNearestStation()
    }
  }

  return (
    <div className="flex h-screen font-sans">
      <Sidebar
        brands={brands}
        models={models}
        stations={stations}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
      />
      <main className="flex-1 relative">
        <button
          onClick={locateSelectedStation}
          className="absolute z-10 m-3 px-3 py-2 rounded bg-blue-600 text-white shadow"
        >
          Locate selected station
        </button>
        <div ref={mapRef} className="w-full h-full" />
      </main>
    </div>
  )
}
