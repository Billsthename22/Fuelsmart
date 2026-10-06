# Mixed Nearby Station Discovery Design

## Purpose

FuelSmart must show every discoverable fuel station within the driver-selected radius, not only stations registered by an administrator. Registered FuelSmart branches retain trusted operational and price data; Google Places results provide broader discovery without being presented as trusted FuelSmart data.

## Station sources and trust

- MongoDB remains the source of FuelSmart-registered stations, prices, fuel availability, and station operating status.
- Google Places Nearby Search supplies additional fuel-station names, addresses, coordinates, and distance.
- FuelSmart records display `Verified`; Google-only listings display `Unverified`.
- Unverified listings never display invented prices, availability, or opening status. Their price copy is `Prices unavailable`.
- A nearby Google listing that matches a FuelSmart branch by brand/name and lies within 250 metres is removed in favour of the verified FuelSmart record.

## Discovery flow

After authentication, the driver location starts two lookups for the selected `1`, `5`, `8`, `15`, `25`, or `50` kilometre radius. FuelSmart queries MongoDB using the existing geospatial endpoint, while Google Places searches for the `gas_station` primary type. The client merges and sorts the results nearest-first.

Changing the radius repeats both lookups. Searching an address changes the scan centre. Fuel-type and available-only filters show verified FuelSmart records only because unverified listings have no trusted inventory information.

## Failure behaviour

FuelSmart database results remain visible when Google Places is unavailable, disabled, or misconfigured. When location is unavailable, the address fallback remains available. The Google request is bounded to 20 results and 50 kilometres.

## UI

Both the dashboard list and map panel distinguish verified and unverified listings. Selecting either kind focuses it on the map and enables external Google Maps navigation. Verified station detail includes real prices and status; unverified station detail explains that prices are unavailable until verification.

## Google configuration

The existing `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is used with Maps JavaScript API and Places API (New). The key should be HTTP-referrer restricted in Google Cloud. Nearby Search uses only `id`, `displayName`, `formattedAddress`, and `location` fields.

