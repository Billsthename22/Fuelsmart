export function shouldTrackDeviceLocation(_initialPoint: { lat: number; lng: number } | null) {
  return _initialPoint === null || (Number.isFinite(_initialPoint.lat) && Number.isFinite(_initialPoint.lng));
}
