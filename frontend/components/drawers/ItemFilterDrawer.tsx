import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  MapPressEvent,
} from 'react-native-maps';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import PriceRangeInput from '../PriceRangeInput';
import { ITEM_FILTER_OPTIONS } from '@/constants/FilterOptions';
import FilterDrawer from './FilterDrawer';
import { ItemFilters } from '@/app/(tabs)/shop';
import { Colors } from '@/constants/Colors';
import { useLocation } from '@/context/LocationContext';
import { DEFAULT_LOCATION } from '@/constants/Location';

interface Props {
  currentFilters: ItemFilters;
  onApplyFilters: (filters: ItemFilters) => void;
  onClose?: () => void;
}

interface LocationState {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export default function ItemFilterDrawer({
  currentFilters,
  onApplyFilters,
  onClose,
}: Props) {
  const { locationFilter, userLocation, setLocationFilter } = useLocation();
  const [selectedFilter, setSelectedFilter] = useState<string>(
    currentFilters.category
  );
  const [priceRange, setPriceRange] = useState(currentFilters.priceRange);
  const [location, setLocation] = useState<LocationState>(() => {
    return {
      latitude: locationFilter?.latitude || userLocation.coordinates[1],
      longitude: locationFilter?.longitude || userLocation.coordinates[0],
      radiusKm: locationFilter?.radiusKm || DEFAULT_LOCATION.radiusKm,
    };
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const mapRef = useRef<MapView>(null);
  const MIN_RADIUS = 5;
  const MAX_RADIUS = 200;

  // Sets map zoom level so the search radius circle is fully visible in the viewport.
  const getLatitudeDelta = useCallback((radiusKm: number) => {
    return (radiusKm * 2.5) / 111;
  }, []);

  // Sets map zoom level for longitude
  const getLongitudeDelta = useCallback(
    (latitude: number, radiusKm: number) => {
      const latRad = (latitude * Math.PI) / 180;
      return (radiusKm * 2.5) / (111 * Math.cos(latRad));
    },
    []
  );

  const getCurrentLocation = useCallback(async () => {
    try {
      setIsLoadingLocation(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(prev => {
        const newLocation = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          radiusKm: prev.radiusKm,
        };
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            latitudeDelta: getLatitudeDelta(newLocation.radiusKm),
            longitudeDelta: getLongitudeDelta(
              newLocation.latitude,
              newLocation.radiusKm
            ),
          });
        }
        return newLocation;
      });
    } catch {
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Using default location.'
      );
    } finally {
      setIsLoadingLocation(false);
    }
  }, [getLatitudeDelta, getLongitudeDelta]);

  // Sync local location state and map view with context on mount
  useEffect(() => {
    if (locationFilter) {
      setLocation({
        latitude: locationFilter.latitude,
        longitude: locationFilter.longitude,
        radiusKm: locationFilter.radiusKm,
      });
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: locationFilter.latitude,
          longitude: locationFilter.longitude,
          latitudeDelta: getLatitudeDelta(locationFilter.radiusKm),
          longitudeDelta: getLongitudeDelta(
            locationFilter.latitude,
            locationFilter.radiusKm
          ),
        });
      }
    }
  }, [locationFilter, getLatitudeDelta, getLongitudeDelta]);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation(prev => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const handleRadiusChange = useCallback(
    (radius: number) => {
      const clampedRadius = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, radius));
      setLocation(prev => {
        const newLocation = { ...prev, radiusKm: clampedRadius };
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: prev.latitude,
            longitude: prev.longitude,
            latitudeDelta: getLatitudeDelta(clampedRadius),
            longitudeDelta: getLongitudeDelta(prev.latitude, clampedRadius),
          });
        }
        return newLocation;
      });
    },
    [getLatitudeDelta, getLongitudeDelta]
  );

  const handleApply = () => {
    const locationFilterValue = {
      latitude: location.latitude,
      longitude: location.longitude,
      radiusKm: location.radiusKm,
    };

    setLocationFilter(locationFilterValue);

    const newFilters: ItemFilters = {
      priceRange,
      category: selectedFilter,
    };
    onApplyFilters(newFilters);
  };

  const CategoryContent = (
    <>
      <Text style={styles.sectionTitle}>Filters:</Text>
      <View style={styles.filterContainer}>
        {ITEM_FILTER_OPTIONS.map(option => (
          <Pressable
            key={option}
            style={[
              styles.filterOption,
              selectedFilter === option && styles.filterOptionActive,
            ]}
            onPress={() =>
              setSelectedFilter(selectedFilter === option ? '' : option)
            }
          >
            <Text
              style={[
                styles.filterOptionText,
                selectedFilter === option && styles.filterOptionTextActive,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Filter by Cost:</Text>
      <View style={styles.priceRangeContainer}>
        <PriceRangeInput
          minValue={priceRange.min}
          maxValue={priceRange.max}
          onMinChange={(min: number) => setPriceRange({ ...priceRange, min })}
          onMaxChange={(max: number) => setPriceRange({ ...priceRange, max })}
        />
      </View>
    </>
  );

  const LocationContent = (
    <>
      <Text style={styles.sectionTitle}>Location Filters:</Text>
      <View style={styles.locationContainer}>
        <View style={styles.mapWrapper}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: getLatitudeDelta(location.radiusKm),
              longitudeDelta: getLongitudeDelta(
                location.latitude,
                location.radiusKm
              ),
            }}
            onPress={showSlider ? handleMapPress : undefined}
            scrollEnabled={showSlider}
            zoomEnabled={showSlider}
            rotateEnabled={showSlider}
            pitchEnabled={false}
            mapType="standard"
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              pinColor={Colors.light.filterBlue}
              title="Search Center"
            />
            <Circle
              center={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              radius={location.radiusKm * 1000}
              strokeColor={Colors.light.filterBlue}
              fillColor={Colors.light.mapCircleFill}
              strokeWidth={2}
            />
          </MapView>
          {!showSlider && (
            <View style={styles.mapControls} pointerEvents="box-none">
              <View style={styles.buttonsRow}>
                <Pressable
                  style={[
                    styles.locationButton,
                    isLoadingLocation && styles.locationButtonDisabled,
                  ]}
                  onPress={getCurrentLocation}
                  disabled={isLoadingLocation}
                >
                  <Text style={styles.locationButtonText}>
                    {isLoadingLocation ? 'Loading...' : 'Use my location'}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.locationButton}
                  onPress={() => setShowSlider(true)}
                >
                  <Text style={styles.locationButtonText}>Edit</Text>
                </Pressable>
              </View>
            </View>
          )}
          {showSlider && (
            <View style={styles.sliderContainer} pointerEvents="box-none">
              <View style={styles.sliderWrapper}>
                <Slider
                  style={styles.slider}
                  minimumValue={MIN_RADIUS}
                  maximumValue={MAX_RADIUS}
                  value={Math.max(
                    MIN_RADIUS,
                    Math.min(MAX_RADIUS, location.radiusKm)
                  )}
                  onValueChange={handleRadiusChange}
                  minimumTrackTintColor={Colors.light.filterBlue}
                  maximumTrackTintColor={Colors.light.sliderGray}
                  thumbTintColor={Colors.light.filterBlue}
                  step={1}
                />
              </View>
              <Pressable
                style={styles.applyButton}
                onPress={() => {
                  setShowSlider(false);
                }}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </>
  );

  return (
    <FilterDrawer
      onClose={onClose}
      onApply={handleApply}
      title="Sort Filters By:"
      isTwoSided={true}
      sideOneLabel="Category"
      sideTwoLabel="Location"
      sideOneContent={CategoryContent}
      sideTwoContent={LocationContent}
    />
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  filterContainer: {
    gap: 15,
    marginBottom: 16,
    width: '100%',
  },
  priceRangeContainer: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  filterOption: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.filterBorder,
    backgroundColor: Colors.light.formInputBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    borderColor: Colors.light.filterBlue,
    backgroundColor: Colors.light.filterActiveBackground,
  },
  filterOptionText: {
    fontSize: 14,
    color: Colors.light.filterText,
  },
  filterOptionTextActive: {
    color: Colors.light.filterBlue,
  },
  locationContainer: {
    width: '100%',
    alignItems: 'center',
  },
  mapWrapper: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapControls: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  locationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.fishBlue,
    minWidth: 150,
    alignItems: 'center',
  },
  locationButtonDisabled: {
    opacity: 0.5,
  },
  locationButtonText: {
    fontSize: 14,
    color: Colors.light.fishBlue,
    fontWeight: '600',
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    pointerEvents: 'box-none',
    gap: 12,
  },
  sliderWrapper: {
    alignItems: 'center',
    backgroundColor: Colors.light.transparent,
    borderRadius: 12,
    paddingHorizontal: 16,
    width: 280,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },
  slider: {
    width: 248,
    height: 40,
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.fishBlue,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },
  applyButtonText: {
    fontSize: 14,
    color: Colors.light.white,
    fontWeight: '600',
  },
});
