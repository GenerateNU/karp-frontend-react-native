import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  MapPressEvent,
} from 'react-native-maps';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import { Colors } from '@/constants/Colors';
import { useLocation } from '@/context/LocationContext';
import { DEFAULT_LOCATION } from '@/constants/Location';

interface LocationState {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

interface LocationMapFilterProps {
  onLocationChange?: (location: LocationState) => void;
  style?: any;
}

export default function LocationMapFilter({
  onLocationChange,
  style,
}: LocationMapFilterProps) {
  const { locationFilter, userLocation, setLocationFilter } = useLocation();
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
      // Request permissions first
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use this feature.'
        );
        setIsLoadingLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        radiusKm: location.radiusKm,
      };

      setLocation(newLocation);

      // Update the location filter in context immediately
      setLocationFilter({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        radiusKm: newLocation.radiusKm,
      });

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
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please try again.'
      );
    } finally {
      setIsLoadingLocation(false);
    }
  }, [
    getLatitudeDelta,
    getLongitudeDelta,
    location.radiusKm,
    setLocationFilter,
  ]);

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

  // Notify parent of location changes
  useEffect(() => {
    if (onLocationChange) {
      onLocationChange(location);
    }
  }, [location, onLocationChange]);

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

  const handleApply = useCallback(() => {
    const locationFilterValue = {
      latitude: location.latitude,
      longitude: location.longitude,
      radiusKm: location.radiusKm,
    };
    console.log('Applying location filter:', locationFilterValue);
    setLocationFilter(locationFilterValue);
    setShowSlider(false);

    // Notify parent component if callback is provided
    if (onLocationChange) {
      onLocationChange(locationFilterValue);
    }
  }, [location, setLocationFilter, onLocationChange]);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.sectionTitle}>Location Filters:</Text>

      <View style={styles.locationContainer}>
        {Platform.OS === 'web' ? (
          <View style={styles.mapWrapper}>
            <Text style={styles.webMapPlaceholder}>
              Map view is not available on web. Please use the mobile app for
              location filtering.
            </Text>
          </View>
        ) : (
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
              <View style={styles.mapControls}>
                <View style={styles.buttonsRow}>
                  <Pressable
                    style={[
                      styles.locationButton,
                      isLoadingLocation && styles.locationButtonDisabled,
                    ]}
                    onPress={getCurrentLocation}
                    disabled={isLoadingLocation}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.locationButtonText}>
                      {isLoadingLocation ? 'Loading...' : 'Use my location'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.locationButton}
                    onPress={() => setShowSlider(true)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.locationButtonText}>Edit</Text>
                  </Pressable>
                </View>
              </View>
            )}
            {showSlider && (
              <View style={styles.sliderContainer} pointerEvents="box-none">
                <View style={styles.sliderWrapper}>
                  <Text style={styles.radiusText}>
                    Radius: {Math.round(location.radiusKm)} km
                  </Text>
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
                <Pressable style={styles.applyButton} onPress={handleApply}>
                  <Text style={styles.applyButtonText}>Apply</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  locationContainer: {
    width: '100%',
    marginBottom: 16,
  },
  mapWrapper: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webMapPlaceholder: {
    padding: 20,
    textAlign: 'center',
    color: '#666',
  },
  mapControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    zIndex: 1000,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  locationButton: {
    backgroundColor: Colors.light.filterBlue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  locationButtonDisabled: {
    opacity: 0.5,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sliderWrapper: {
    marginBottom: 12,
  },
  radiusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  applyButton: {
    backgroundColor: Colors.light.filterBlue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
