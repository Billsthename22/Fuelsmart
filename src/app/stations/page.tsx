'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import Sidebar from '@/app/components/Sidebar'
import carData from '@/data/car_brands_models.json'
import Navbar from '../components/Navbar'
const stations = [
  'NNPC','Total','TotalEnergies','Oando','MRS','Conoil',
  'Enyo','Ardova','Mobil','Rainoil','Eterna','NorthWest Petroleum',
  'Heyden','AA Rano','Forte Oil','Nipco','Acorn','Ammasco','Petrocam'
]

type ResultItem = {
  name: string
  address?: string
  placeId?: string
  position: google.maps.LatLngLiteral
  distanceKm: number
  marker: google.maps.marker.AdvancedMarkerElement
}

const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID!
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

export default function FuelMapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const dirRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)

  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedStation, setSelectedStation] = useState('')
  const [userPos, setUserPos] = useState<google.maps.LatLngLiteral | null>(null)
  const [mapsReady, setMapsReady] = useState(false)
  const [results, setResults] = useState<ResultItem[]>([])
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSearchStation, setLastSearchStation] = useState('')

  const brands = Object.keys(carData)
  const models = selectedBrand && selectedBrand in carData
    ? carData[selectedBrand as keyof typeof carData] : []

  useEffect(() => {
    const loader = new Loader({
      apiKey: API_KEY,
      version: 'weekly',
      libraries: ['marker', 'places'],
    })
    loader.load().then(() => {
      if (!mapRef.current) return
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 6.535, lng: 3.384 },
        zoom: 13,
        mapId: MAP_ID,
      })
      mapInstance.current = map
      dirRendererRef.current = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: { strokeWeight: 5 },
      })
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

  const haversineKm = useCallback((a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral) => {
    const R = 6371
    const dLat = toRad(b.lat - a.lat)
    const dLng = toRad(b.lng - a.lng)
    const lat1 = toRad(a.lat)
    const lat2 = toRad(b.lat)
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
    return 2 * R * Math.asin(Math.sqrt(h))
  }, [])
  
  function toRad(x: number) { return x * Math.PI / 180 }

  const clearResults = useCallback(() => {
    results.forEach(r => (r.marker.map = null))
    setResults([])
    setActiveIdx(null)
    dirRendererRef.current?.set('directions', null)
  }, [results])

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
        map, position: p, title: 'Your location', content,
      })
    } else {
      userMarkerRef.current.position = p
    }
  }

  const routeTo = useCallback((item: ResultItem, idx: number) => {
    if (!mapInstance.current || !dirRendererRef.current) return
    if (!userPos) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            setUserPos(p)
            placeOrUpdateUserMarker(p)
            // Note: We don't recursively call routeTo here to avoid issues
          },
          () => {}
        )
      }
      return
    }
    const dirSvc = new google.maps.DirectionsService()
    const req: google.maps.DirectionsRequest = {
      origin: userPos,
      destination: item.position,
      travelMode: google.maps.TravelMode.DRIVING,
    }
    dirSvc.route(req, (res, status) => {
      if (status === 'OK' && res) {
        dirRendererRef.current!.setDirections(res)
        setActiveIdx(idx)
      }
    })
  }, [userPos])

  const searchBrandWithin8km = useCallback(async (brand: string) => {
    console.log(`Starting search for ${brand}`)
    setIsLoading(true)
    clearResults()
    const map = mapInstance.current!
    const origin = userPos ?? map.getCenter()!.toJSON()

    const textQuery =
      brand === 'Total' ? 'Total gas station'
      : brand === 'TotalEnergies' ? 'TotalEnergies gas station'
      : `${brand} gas station`

    // Use simpler request format to avoid 400 errors
    const body = {
      textQuery,
      locationBias: {
        circle: {
          center: { latitude: origin.lat, longitude: origin.lng },
          radius: 8000,
        },
      },
      pageSize: 20,
    }

    try {
      console.log('Sending request with body:', body)
      const resp = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': [
            'places.id',
            'places.displayName',
            'places.formattedAddress',
            'places.location',
          ].join(','),
        },
        body: JSON.stringify(body),
      })

      if (!resp.ok) {
        const errorText = await resp.text()
        console.error('API Error:', resp.status, errorText)
        
        if (resp.status === 429) {
          console.warn('Rate limit exceeded. Please wait before making another request.')
          setTimeout(() => setIsLoading(false), 5000)
          return
        } else if (resp.status === 400) {
          console.error('Bad Request - Invalid API request format')
          setResults([])
          dirRendererRef.current?.set('directions', null)
          return
        }
        
        throw new Error(`HTTP error! status: ${resp.status}`)
      }

      const data: {
        places?: Array<{
          id?: string
          displayName?: { text?: string }
          formattedAddress?: string
          location?: { latitude: number, longitude: number }
        }>
      } = await resp.json()

      console.log('API response received:', data)

      const items: ResultItem[] = []
      const bounds = new google.maps.LatLngBounds()
      if (userPos) bounds.extend(userPos)

      if (data.places) {
        data.places.forEach((p, i) => {
          if (!p.location) return
          const pos = { lat: p.location.latitude, lng: p.location.longitude }
          const dist = userPos ? haversineKm(userPos, pos) : NaN
          const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: pos,
            title: p.displayName?.text || `${brand} Station ${i + 1}`,
          })  
          marker.addListener('gmp-click', () => {
            const idx = items.findIndex(it => it.marker === marker)
            if (idx >= 0) routeTo(items[idx], idx)
          })      
          items.push({
            name: p.displayName?.text || brand,
            address: p.formattedAddress,
            placeId: p.id,
            position: pos,
            distanceKm: dist,
            marker,
          })
          bounds.extend(pos)
        })
      }

      // Fit to all results plus user
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, 64)
      }

      const sorted = userPos ? items.sort((a, b) => a.distanceKm - b.distanceKm) : items
      setResults(sorted)
      console.log(`Found ${sorted.length} results for ${brand}`)

      // Optional: draw route to nearest without hiding others
      if (sorted.length > 0) routeTo(sorted[0], 0)
      
    } catch (error) {
      console.error('Error searching for stations:', error)
      setResults([])
      dirRendererRef.current?.set('directions', null)
    } finally {
      console.log(`Search completed for ${brand}`)
      setIsLoading(false)
    }
  }, [clearResults, haversineKm, routeTo, userPos])

  useEffect(() => {
    if (!mapsReady || !mapInstance.current || !selectedStation) return
    if (isLoading || lastSearchStation === selectedStation) return
    
    const timeoutId = setTimeout(() => {
      console.log(`Triggering search for: ${selectedStation}`)
      setLastSearchStation(selectedStation)
      searchBrandWithin8km(selectedStation)
    }, 1000) // 1 second delay to debounce
    
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStation, mapsReady])

  function locateSelectedStation() {
    if (!selectedStation || !mapInstance.current || isLoading) return
    
    // Clear previous search results
    setLastSearchStation('')
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserPos(p)
          placeOrUpdateUserMarker(p)
          // The useEffect will trigger the search automatically
        },
        () => {
          // Even on geolocation error, trigger search with current location
          // The useEffect will trigger the search automatically
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    }
  }

  return (
  <>
  <Navbar/>
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
          disabled={isLoading || !selectedStation}
          className={`absolute z-10 m-3 px-3 py-2 rounded shadow text-white ${
            isLoading || !selectedStation 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Searching...' : `Find ${selectedStation || 'station'} nearby`}
        </button>

        <div className="absolute z-10 right-3 top-3 max-h-[60vh] w-[340px] overflow-auto rounded-lg bg-white/95 shadow border">
          <div className="px-3 py-2 font-semibold border-b">Within 8 km</div>
          {isLoading ? (
            <div className="px-3 py-3 text-sm text-gray-600">Searching for stations...</div>
          ) : results.length === 0 ? (
            <div className="px-3 py-3 text-sm text-gray-600">No stations found.</div>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li
                  key={r.placeId || `${r.position.lat},${r.position.lng}-${i}`}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${activeIdx === i ? 'bg-blue-50' : ''}`}
                  onClick={() => routeTo(r, i)}
                >
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-gray-600">
                    {r.address || ''}{r.address ? ' • ' : ''}{isFinite(r.distanceKm) ? `${r.distanceKm.toFixed(1)} km` : ''}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div ref={mapRef} className="w-full h-full" />
      </main>
    </div>
  </>
  )
}
