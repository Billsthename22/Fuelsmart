# Mixed Nearby Station Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Combine verified FuelSmart branches with unverified Google fuel-station listings inside the selected driver radius.

**Architecture:** MongoDB and Google Places remain independent sources. Client-side discovery converts Google Places into the shared station-summary shape, removes overlaps in favour of verified records, and sorts the combined list by distance.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, MongoDB/Mongoose, Google Maps JavaScript API Places (New), Vitest, React Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-06-mixed-nearby-station-discovery-design.md`

## Global Constraints

- Unverified stations must never receive FuelSmart prices, availability, or operating status.
- Verified FuelSmart records win duplicate matching.
- Radius stays between 1 and 50 kilometres.
- Google failure must not hide FuelSmart database results.
- Results are sorted nearest-first.

## Review Focus

- Google and FuelSmart duplicates within 250 metres resolve to the verified record.
- Google-only stations render `Unverified` and `Prices unavailable`.
- Changing radius updates MongoDB and Google Places searches.
- Fuel-specific filters exclude listings with unknown inventory.
- Missing Places API access leaves verified FuelSmart results usable.

---

### Task 1: Merge the station sources

**Files:**
- Create: `src/app/lib/nearby-stations.ts`
- Test: `src/app/lib/nearby-stations.test.ts`
- Modify: `src/app/lib/stations.ts`

**Interfaces:**
- Produces: `mergeNearbyStations(verified, discovered)` and `searchNearbyGoogleStations({ apiKey, center, radiusKm })`.

- [x] Write failing tests for unverified preservation, duplicate removal, and distance ordering.
- [x] Implement bounded Google Places conversion and verified-first merging.
- [x] Run the focused tests and type checking.

### Task 2: Expose trust and price state in the UI

**Files:**
- Modify: `src/app/components/dashboard/StationCard.tsx`
- Modify: `src/app/components/map/NearbyMapStationList.tsx`
- Modify: `src/app/components/map/StationDetailsPanel.tsx`
- Test: `src/app/components/map/FuelStationMap.test.tsx`

**Interfaces:**
- Consumes: the shared `StationSummary.verified` flag and empty prices for Google-only stations.

- [x] Write a failing UI test for `Unverified` and `Prices unavailable`.
- [x] Render separate verification and operating-status information.
- [x] Preserve directions for both station sources.

### Task 3: Scan the selected radius automatically

**Files:**
- Modify: `src/app/Dashboard/page.tsx`
- Modify: `src/app/stations/page.tsx`
- Modify: `src/app/components/dashboard/NearbyStationList.tsx`
- Modify: `src/app/components/dashboard/StationCard.tsx`
- Test: `src/app/components/dashboard/NearbyStationList.test.tsx`

**Interfaces:**
- Carries: `radiusKm` from dashboard station links into `/stations`.

- [x] Write a failing test proving the map link carries the selected radius.
- [x] Run MongoDB and Google discovery after location becomes available.
- [x] Add the map radius selector and repeat discovery when it changes.
- [x] Keep registered results when Google search fails.

### Task 4: Verify the completed feature

- [x] Run `npm test` — 28 tests pass.
- [x] Run `npm run typecheck` — no errors.
- [x] Run focused ESLint — no errors.
- [x] Run `npm run build` — production build succeeds.

