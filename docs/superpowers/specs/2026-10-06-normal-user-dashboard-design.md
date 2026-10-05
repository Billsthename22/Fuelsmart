# FuelSmart Normal-User Dashboard Design

Date: 2026-10-06
Status: Approved in conversation

## Objective

Complete the normal-user experience so a driver can quickly find verified FuelSmart stations near their current location, compare real admin-managed prices and availability, and open a dedicated map for navigation.

The dashboard remains a fast summary and decision screen. The full interactive map remains on `/stations`.

## Scope

### Real functionality

- Authenticate the current user and restrict the normal-user dashboard to `DRIVER` accounts.
- Request browser geolocation with a clear loading, denial, and retry experience.
- Query verified FuelSmart stations from MongoDB through the existing station API.
- Display each station's brand, branch, address, operating status, distance, current fuel prices, fuel availability, and last update time.
- Filter nearby stations by search text, radius, fuel type, and fuel availability.
- Link a selected station to `/stations?stationId=<id>`.
- On `/stations`, load the selected FuelSmart station, focus its marker, and allow route rendering or opening Google Maps navigation.
- Provide address search as a fallback when browser location is unavailable or denied.

### Deliberately retained demo UI

The existing rewards, savings, AI forecast, price trend, and community-report concepts remain visible so the product owner can decide their eventual behavior. These sections must be isolated from real station data and marked in source code as demo placeholders. They must not imply that backend calculations or verified community reports exist.

### Out of scope

- Rewards accounting
- Savings calculations
- AI price forecasting
- Driver verification counts
- Community-report submission and moderation
- Persistent vehicle profiles
- Mobile-native application work

## Architecture

### Dashboard

`/Dashboard` is the normal user's home screen. It contains:

1. User greeting and account controls.
2. Location status and nearby-station filters.
3. A real nearby-stations list sourced from the FuelSmart API.
4. Summary values derived only from the returned station data, such as nearby branch count and lowest available price.
5. Existing demo cards in a clearly separated placeholder area.

The dashboard does not initialize Google Maps. This keeps initial rendering lighter and avoids loading the Maps SDK until the user opens the map workspace.

### Station API

The public nearby-station endpoint remains the source of truth for discoverable branches. It returns only verified stations and accepts coordinates plus a bounded radius.

The response will expose sufficient presentation data for the dashboard without additional per-station requests. Distance should be returned by the server when coordinates are supplied. Current prices must be normalized so each fuel type appears only once.

The endpoint must validate coordinates and clamp the supported radius. A request without coordinates returns at most 50 verified stations ordered by most recently updated; it never returns an unbounded station collection.

### Map workspace

`/stations` stops discovering arbitrary petrol stations through Google Places. It reads registered FuelSmart stations from the API and renders those stations as map markers.

When `stationId` is present:

1. The page loads nearby stations or the selected station record.
2. The map focuses the selected branch.
3. The station detail panel shows real prices, availability, address, and status.
4. Directions use Google Maps Directions from the user's location to the stored station coordinates.
5. External navigation opens Google Maps using the selected coordinates.

Google Places is used only for address/location fallback, not as the source of station names or prices.

## User Flow

1. A driver logs in and is redirected to `/Dashboard`.
2. The dashboard requests location permission.
3. If granted, verified stations within the default radius are loaded and sorted nearest-first.
4. The driver can adjust radius, search by station/branch/address, and filter by fuel type or availability.
5. The driver selects a station and opens the full map.
6. `/stations` focuses the station and can display a driving route.
7. If location permission is denied, the dashboard explains the limitation and offers address search or a retry action.

## States and Error Handling

- **Loading location:** explain that nearby stations require location.
- **Permission denied:** retain the page, show a retry control, and offer manual address search.
- **Missing Google Maps key:** station cards continue working; the map page shows a configuration message instead of crashing.
- **No nearby stations:** show an empty state with controls to increase the radius.
- **API failure:** show a retryable error without replacing the demo sections.
- **No prices:** show "No prices reported" rather than a zero or fabricated price.
- **Closed station:** keep the station visible but visibly mark it closed; routing remains available.
- **Unavailable fuel:** display the saved price only with an explicit unavailable state.

## Security and Access

- The dashboard validates the current session using `/api/auth/me`.
- `ADMIN` and `SUPER_ADMIN` accounts are redirected to their role-specific areas.
- Public station discovery returns only verified stations.
- UI controls never determine authorization; mutation endpoints remain role-protected server-side.
- Browser-exposed Google credentials remain restricted API keys suitable for client-side Maps usage.

## Environment Repair

Before feature verification:

- Remove duplicate dependency declarations from `package.json`.
- Align `next` and `eslint-config-next` to the same supported version family.
- Retain one package manager for this repository.
- Configure `outputFileTracingRoot` to the FuelSmart project directory so the unrelated home-directory lockfile is not treated as the workspace root.
- Reinstall the corrupted `@next/swc-darwin-arm64` binary through the package manager and verify native SWC loads without the WASM fallback warning.

The unrelated `/Users/anonymous/pnpm-lock.yaml` will not be deleted automatically because it may belong to another project.

## Component Boundaries

- `Dashboard`: page orchestration, authentication, location, filter state.
- `NearbyStationList`: loading, error, empty, and populated station-list presentation.
- `StationCard`: one station's real status, distance, prices, and map action.
- `DashboardDemoWidgets`: existing fake trend/reward/AI/community concepts only.
- `FuelMapPage`: Maps lifecycle, registered markers, selected station, and routing.
- Station API: validation, geospatial lookup, normalization, and distance calculation.

These boundaries prevent demo concepts from leaking into the real discovery flow and keep map-specific code out of the dashboard.

## Testing and Verification

- API tests for radius clamping, verified-only results, nearest-first ordering, and one price per fuel type.
- Component tests for loading, denied-location, empty, API-error, open/closed, priced/unpriced, and available/unavailable states.
- Navigation test proving a dashboard station opens `/stations` with the correct station ID.
- Map behavior test with Google Maps calls mocked, covering selected marker and directions request.
- Authentication tests for driver access and role redirects.
- Dependency verification with `npm ls`.
- Type checking and production build.
- Manual browser verification at mobile and desktop widths.

## Success Criteria

- A driver sees real FuelSmart station data on the dashboard.
- The user can filter nearby stations and understand price, availability, status, distance, and freshness.
- Selecting a station opens the dedicated map focused on that station.
- Directions use the station's registered coordinates.
- Demo widgets remain visible but are structurally separate from real data.
- The development server starts with native SWC and without the incorrect workspace-root warning.
