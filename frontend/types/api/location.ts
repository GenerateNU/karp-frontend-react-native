export interface LocationFilter {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export interface Location {
  type: string;
  coordinates: [number, number];
}
