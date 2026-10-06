# FuelSmart Normal-User Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real nearby-station experience for drivers on `/Dashboard` and a registered-station navigation workspace on `/stations`, while retaining the existing product-concept widgets as isolated demo UI.

**Architecture:** The station API is the sole source of discoverable branches and returns normalized station summaries with server-computed distance. The dashboard owns authentication, location, filters, and list presentation without initializing a map; the map page consumes the same station contract and uses Google Maps only for markers, address fallback, and directions.

**Tech Stack:** Next.js 16.2.11 App Router, React 19.2.8, TypeScript, Mongoose/MongoDB geospatial queries, Google Maps JavaScript API, Vitest, React Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-06-normal-user-dashboard-design.md`

## Global Constraints

- Only verified FuelSmart stations are publicly discoverable.
- Closed stations remain visible and are clearly marked; fuel availability remains separate from station operating status.
- Radius is clamped from 1 km to 50 km, with 8 km as the default.
- Requests without coordinates return at most 50 verified stations ordered by most recently updated.
- Google Places must not create or supply station records or fuel prices.
- Rewards, savings, AI forecasting, trends, and community reports remain demo-only and isolated from real station data.
- `/Dashboard` does not initialize a Google map; `/stations` owns map and route rendering.
- Do not delete `/Users/anonymous/pnpm-lock.yaml` because it may belong to another project.

## Review Focus

- Invalid, missing, or out-of-range coordinates produce a bounded response or a clear 400 response and never an unbounded query; covered in Task 2 API tests.
- Duplicate stored prices for the same fuel type collapse to the most recently updated value; covered in Task 2 serializer tests.
- Location denial leaves the dashboard usable with retry and address fallback; covered in Task 3 component tests.
- A closed station remains discoverable but cannot be mistaken for open; covered in Tasks 2 and 3 tests.
- Missing Google Maps configuration shows a useful map-page error while dashboard station discovery continues to work; covered in Task 4 tests.

---

### Task 1: Repair the Next.js Toolchain and Add the Test Harness

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `next.config.ts`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

**Interfaces:**
- Consumes: existing npm project and Next.js configuration.
- Produces: `npm test`, `npm run typecheck`, and aligned Next.js tooling used by every later task.

- [ ] **Step 1: Record the failing native-toolchain checks**

Run `npm ls next eslint-config-next react react-dom @next/swc-darwin-arm64 --depth=0` and `node -e "require('@next/swc-darwin-arm64')"`.

Expected before repair: Next.js/ESLint major versions disagree and native SWC throws the Mach-O `__TEXT` load-command error.

- [ ] **Step 2: Normalize package declarations and scripts**

Set `next` and `eslint-config-next` to `16.2.11`, `react` and `react-dom` to `19.2.8`, remove duplicate JSON keys, and add scripts `test: "vitest run"` and `typecheck: "tsc --noEmit"`. Add compatible `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, and `@vitejs/plugin-react` development dependencies.

- [ ] **Step 3: Pin the workspace root**

Set `outputFileTracingRoot: process.cwd()` in `next.config.ts`; leave the home-directory pnpm lockfile untouched.

- [ ] **Step 4: Install dependencies and replace only the corrupted SWC package**

Remove `node_modules/@next/swc-darwin-arm64`, run `npm install`, and verify the reinstalled native module loads. This deletion is limited to a reproducible dependency artifact restored by npm.

- [ ] **Step 5: Configure Vitest**

Configure the `@/` alias, `jsdom`, React transform, and `src/test/setup.ts` with `@testing-library/jest-dom/vitest`.

- [ ] **Step 6: Verify the repaired environment**

Run `npm ls next eslint-config-next react react-dom @next/swc-darwin-arm64 --depth=0`, `node -e "require('@next/swc-darwin-arm64')"`, and `npm run typecheck`.

Expected: aligned versions, native require exits 0, and any remaining type errors are captured before feature changes.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json next.config.ts vitest.config.ts src/test/setup.ts
git commit -m "chore: repair Next.js toolchain and add tests"
```

### Task 2: Define and Serve the Nearby-Station Contract

**Files:**
- Create: `src/app/lib/stations.ts`
- Create: `src/app/lib/stations.test.ts`
- Create: `src/app/api/stations/query.ts`
- Create: `src/app/api/stations/query.test.ts`
- Modify: `src/app/api/stations/route.ts`
- Modify: `src/app/api/stations/[stationId]/route.ts`

**Interfaces:**
- Consumes: `Station` documents with GeoJSON `[longitude, latitude]` coordinates and `currentPrices`.
- Produces: `StationSummary`, `FuelPriceSummary`, `parseStationQuery(searchParams)`, `normalizeStation(document, distanceMeters?)`, and JSON `{ stations: StationSummary[] }`.

- [ ] **Step 1: Write failing station-contract tests**

Test `normalizeStation` returns `_id`, brand, branch, state, address, coordinates, status, verified, unique latest `currentPrices`, `distanceKm`, and `lastUpdatedAt`. Assert that a newer duplicate PMS value wins and missing prices return an empty array.

- [ ] **Step 2: Run the contract test and confirm failure**

Run `npm test -- src/app/lib/stations.test.ts`.

Expected: FAIL because the station contract does not exist.

- [ ] **Step 3: Implement the shared station types and serializer**

Add `normalizeStation(document: StationDocumentLike, distanceMeters?: number): StationSummary` to `src/app/lib/stations.ts`. Compute `lastUpdatedAt` from the newest price update, falling back to station `updatedAt`.

- [ ] **Step 4: Run the serializer tests**

Run `npm test -- src/app/lib/stations.test.ts`.

Expected: PASS.

- [ ] **Step 5: Write failing query-parser tests**

Test `parseStationQuery` for default 8 km, minimum 1 km, maximum 50 km, paired valid coordinates, one missing coordinate returning 400 metadata, nonnumeric coordinates returning 400 metadata, and optional `fuelType`, `available`, and trimmed `search` filters.

- [ ] **Step 6: Run the query tests and confirm failure**

Run `npm test -- src/app/api/stations/query.test.ts`.

Expected: FAIL because `parseStationQuery` does not exist.

- [ ] **Step 7: Implement the parser and API query**

Add `parseStationQuery(searchParams: URLSearchParams): ParsedStationQuery` to `query.ts`. Update `GET /api/stations` to use `$geoNear` for paired coordinates, include verified stations of every operating status, sort nearest-first, apply server-side search/fuel/availability filters, and limit results to 50. Without coordinates, use a verified-only, recently-updated query limited to 50.

- [ ] **Step 8: Protect public station details**

Update `GET /api/stations/[stationId]` to return only a verified station and serialize it through the same contract. Keep the existing super-admin-only PATCH behavior.

- [ ] **Step 9: Run station tests and type checking**

Run `npm test -- src/app/lib/stations.test.ts src/app/api/stations/query.test.ts` and `npm run typecheck`.

Expected: all new tests pass with no new type errors.

- [ ] **Step 10: Commit**

```bash
git add src/app/lib/stations.ts src/app/lib/stations.test.ts src/app/api/stations/query.ts src/app/api/stations/query.test.ts src/app/api/stations/route.ts 'src/app/api/stations/[stationId]/route.ts'
git commit -m "feat: add nearby station discovery contract"
```

### Task 3: Build the Real Driver Dashboard

**Files:**
- Create: `src/app/components/dashboard/StationCard.tsx`
- Create: `src/app/components/dashboard/NearbyStationList.tsx`
- Create: `src/app/components/dashboard/DashboardDemoWidgets.tsx`
- Create: `src/app/components/dashboard/NearbyStationList.test.tsx`
- Modify: `src/app/Dashboard/page.tsx`

**Interfaces:**
- Consumes: `StationSummary` and `GET /api/stations?lat&lng&radiusKm&fuelType&available&search` from Task 2.
- Produces: dashboard filters and links in the form `/stations?stationId=<id>&lat=<lat>&lng=<lng>`.

- [ ] **Step 1: Write failing nearby-list component tests**

Test loading, API error with retry, no stations with radius guidance, open and closed badges, unavailable fuel labeling, no-price copy, distance display, and a map link containing the selected station ID.

- [ ] **Step 2: Run the component test and confirm failure**

Run `npm test -- src/app/components/dashboard/NearbyStationList.test.tsx`.

Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implement station presentation components**

Create `StationCard({ station, userLocation })` and `NearbyStationList({ state, stations, onRetry, userLocation })`. Use the existing navy/emerald theme and ensure every data label distinguishes station status from fuel availability.

- [ ] **Step 4: Extract demo widgets unchanged in meaning**

Move rewards, savings, trend, AI predictor, and community-report concepts into `DashboardDemoWidgets.tsx`. Add a source comment and subtle UI label identifying this group as preview/demo data without removing it.

- [ ] **Step 5: Implement dashboard orchestration**

Rewrite `/Dashboard` to authenticate through `/api/auth/me`, redirect `ADMIN` and `SUPER_ADMIN`, request geolocation, fetch real stations, and expose search, 1/5/8/15/25/50 km radius, fuel type, and available-only controls. Add retry and Google address-autocomplete fallback without constructing a map.

- [ ] **Step 6: Add denied-location coverage**

Extend the test to mock geolocation denial and assert that retry and manual address search remain available and the demo widget group remains rendered.

- [ ] **Step 7: Run dashboard tests and type checking**

Run `npm test -- src/app/components/dashboard/NearbyStationList.test.tsx` and `npm run typecheck`.

Expected: PASS with no new type errors.

- [ ] **Step 8: Commit**

```bash
git add src/app/components/dashboard src/app/Dashboard/page.tsx
git commit -m "feat: connect driver dashboard to nearby stations"
```

### Task 4: Replace Google Station Discovery with FuelSmart Map Navigation

**Files:**
- Create: `src/app/components/map/FuelStationMap.tsx`
- Create: `src/app/components/map/StationDetailsPanel.tsx`
- Create: `src/app/components/map/FuelStationMap.test.tsx`
- Modify: `src/app/stations/page.tsx`
- Delete: `src/app/components/Sidebar.tsx`

**Interfaces:**
- Consumes: `StationSummary`, `stationId`, optional user coordinates, and the station API from Task 2.
- Produces: registered-station markers, selected-station details, internal directions, and external Google Maps navigation URL.

- [ ] **Step 1: Write failing map-shell tests**

Mock the Google Maps loader and test missing API key, API error, selected `stationId`, station detail rendering, route request origin/destination, and external navigation URL coordinates.

- [ ] **Step 2: Run the map test and confirm failure**

Run `npm test -- src/app/components/map/FuelStationMap.test.tsx`.

Expected: FAIL because the map components do not exist.

- [ ] **Step 3: Implement the focused map component**

Create `FuelStationMap({ stations, selectedStationId, userLocation, onSelect })`. Initialize Google Maps once, create one marker per registered station coordinate, clear markers on data change, focus the selected marker, and render driving directions only after an explicit directions action.

- [ ] **Step 4: Implement real station details**

Create `StationDetailsPanel({ station, onDirections, externalMapsUrl })` showing branch, address, operating status, distance, real prices, fuel availability, and freshness.

- [ ] **Step 5: Rewrite the map page data flow**

Read `stationId`, `lat`, and `lng` from search params, authenticate the user, obtain geolocation when coordinates are absent, load FuelSmart stations from `/api/stations`, and select the requested station. Remove car-brand and Google Places station discovery behavior.

- [ ] **Step 6: Remove the obsolete discovery sidebar**

Delete `src/app/components/Sidebar.tsx` after confirming no remaining imports. Retain Google Places only for manual user-location search.

- [ ] **Step 7: Run map tests and type checking**

Run `npm test -- src/app/components/map/FuelStationMap.test.tsx` and `npm run typecheck`.

Expected: PASS with no new type errors.

- [ ] **Step 8: Commit**

```bash
git add src/app/components/map src/app/stations/page.tsx src/app/components/Sidebar.tsx
git commit -m "feat: navigate registered stations on the map"
```

### Task 5: End-to-End Verification and Cleanup

**Files:**
- Modify only files implicated by verification failures in Tasks 1–4.

**Interfaces:**
- Consumes: the complete dashboard and map flow.
- Produces: a verified normal-user experience and clean development startup.

- [ ] **Step 1: Run the complete automated suite**

Run `npm test`, `npm run typecheck`, and `npm run build`.

Expected: all tests pass, type checking exits 0, and production build succeeds.

- [ ] **Step 2: Verify development startup warnings**

Run `npm run dev`, confirm native SWC loads, confirm Next.js uses `/Users/anonymous/Documents/fuelsmart` as its workspace root, and confirm no WASM-lock fallback appears.

- [ ] **Step 3: Verify role and location flows manually**

Check driver login redirect, admin/super-admin redirect away from `/Dashboard`, location granted, location denied, manual address fallback, empty nearby result, radius increase, closed station, unavailable fuel, and no-price station.

- [ ] **Step 4: Verify map navigation manually**

Open a station from the dashboard, confirm `/stations?stationId=...`, selected marker focus, real station details, internal directions, and external Google Maps URL. Check mobile and desktop widths.

- [ ] **Step 5: Confirm demo boundaries**

Verify preview rewards, savings, trend, AI, and community cards remain visible and do not alter real station summary values.

- [ ] **Step 6: Commit verification fixes**

```bash
git add <only-files-changed-during-verification>
git commit -m "fix: complete driver dashboard verification"
```
