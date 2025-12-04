import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LocationFilter, Location } from '@/types/api/location';
import * as ExpoLocation from 'expo-location';
import { DEFAULT_LOCATION } from '@/constants/Location';

type LocationContextValue = {
  userLocation: Location;
  setUserLocation: (location: Location) => void;
  locationFilter: LocationFilter | undefined;
  setLocationFilter: (filter: LocationFilter) => void;
  clearLocationFilter: () => void;
};

const LocationContext = createContext<LocationContextValue | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locationFilter, setLocationFilter] = useState<
    LocationFilter | undefined
  >(undefined);
  const [userLocation, setUserLocation] = useState<Location | undefined>(
    undefined
  );
  const hasInitializedFilter = useRef(false);

  useEffect(() => {
    const getUserLocation = async () => {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await ExpoLocation.getCurrentPositionAsync();
        setUserLocation({
          type: 'Point',
          coordinates: [location.coords.longitude, location.coords.latitude],
        });
      } else {
        setUserLocation({
          type: 'Point',
          coordinates: [DEFAULT_LOCATION.longitude, DEFAULT_LOCATION.latitude],
        });
      }
    };
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation && !hasInitializedFilter.current) {
      hasInitializedFilter.current = true;
      setLocationFilter({
        latitude: userLocation.coordinates[1],
        longitude: userLocation.coordinates[0],
        radiusKm: DEFAULT_LOCATION.radiusKm,
      });
    }
  }, [userLocation]);

  const clearLocationFilter = useCallback(() => {
    hasInitializedFilter.current = false;
    setLocationFilter(undefined);
    if (userLocation) {
      setLocationFilter({
        latitude: userLocation.coordinates[1],
        longitude: userLocation.coordinates[0],
        radiusKm: DEFAULT_LOCATION.radiusKm,
      });
      hasInitializedFilter.current = true;
    }
  }, [userLocation]);

  const value = useMemo<LocationContextValue>(
    () => ({
      userLocation: userLocation || {
        type: 'Point',
        coordinates: [DEFAULT_LOCATION.longitude, DEFAULT_LOCATION.latitude],
      },
      setUserLocation,
      locationFilter: locationFilter,
      setLocationFilter,
      clearLocationFilter,
    }),
    [
      userLocation,
      setUserLocation,
      locationFilter,
      setLocationFilter,
      clearLocationFilter,
    ]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx)
    throw new Error(
      'useLocationFilter must be used within LocationFilterProvider'
    );
  return ctx;
}
