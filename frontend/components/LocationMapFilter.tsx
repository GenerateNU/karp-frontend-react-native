import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
  Platform,
  TextInput,
  Switch,
} from 'react-native';
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  MapPressEvent,
} from 'react-native-maps';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useLocation } from '@/context/LocationContext';
import { DEFAULT_LOCATION } from '@/constants/Location';

interface LocationState {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

interface LocationMapFilterProps {
  onLocationChange?: (location: LocationState) => void;
  onApply?: () => void;
  onClear?: () => void;
  style?: any;
  showTitle?: boolean;
  showSegmentedControl?: boolean;
  activeTab?: 'Category' | 'Location';
  onTabChange?: (tab: 'Category' | 'Location') => void;
}

export default function LocationMapFilter({
  onLocationChange,
  onApply,
  onClear,
  style,
  showTitle = true,
  showSegmentedControl = true,
  activeTab = 'Location',
  onTabChange,
}: LocationMapFilterProps) {
  const { locationFilter, userLocation, setLocationFilter } = useLocation();
  const [location, setLocation] = useState<LocationState>(() => {
    return {
      latitude: locationFilter?.latitude || userLocation.coordinates[1],
      longitude: locationFilter?.longitude || userLocation.coordinates[0],
      radiusKm: locationFilter?.radiusKm || DEFAULT_LOCATION.radiusKm,
    };
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [customRadiusEnabled, setCustomRadiusEnabled] = useState(true);
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

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    try {
      const addresses = await Location.geocodeAsync(searchQuery);
      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        const newLocation = {
          latitude: address.latitude,
          longitude: address.longitude,
          radiusKm: location.radiusKm,
        };
        setLocation(newLocation);
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
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
      Alert.alert(
        'Location Error',
        'Unable to find that location. Please try again.'
      );
    }
  }, [searchQuery, location.radiusKm, getLatitudeDelta, getLongitudeDelta]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setLocation({
      latitude: userLocation.coordinates[1],
      longitude: userLocation.coordinates[0],
      radiusKm: DEFAULT_LOCATION.radiusKm,
    });
    setLocationFilter({
      latitude: userLocation.coordinates[1],
      longitude: userLocation.coordinates[0],
      radiusKm: DEFAULT_LOCATION.radiusKm,
    });
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coordinates[1],
        longitude: userLocation.coordinates[0],
        latitudeDelta: getLatitudeDelta(DEFAULT_LOCATION.radiusKm),
        longitudeDelta: getLongitudeDelta(
          userLocation.coordinates[1],
          DEFAULT_LOCATION.radiusKm
        ),
      });
    }
    if (onClear) {
      onClear();
    }
  }, [
    userLocation,
    setLocationFilter,
    getLatitudeDelta,
    getLongitudeDelta,
    onClear,
  ]);

  const handleApply = useCallback(() => {
    const locationFilterValue = {
      latitude: location.latitude,
      longitude: location.longitude,
      radiusKm: location.radiusKm,
    };
    setLocationFilter(locationFilterValue);

    // Notify parent component if callback is provided
    if (onLocationChange) {
      onLocationChange(locationFilterValue);
    }

    // Close drawer if callback is provided
    if (onApply) {
      onApply();
    }
  }, [location, setLocationFilter, onLocationChange, onApply]);

  return (
    <View style={[styles.container, style]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={Colors.light.primaryText}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Type your location here..."
          placeholderTextColor={Colors.light.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
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
              onPress={customRadiusEnabled ? handleMapPress : undefined}
              scrollEnabled={customRadiusEnabled}
              zoomEnabled={customRadiusEnabled}
              rotateEnabled={customRadiusEnabled}
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
                pinColor={Colors.light.fishBlue}
                title="Search Center"
              />
              {customRadiusEnabled && (
                <Circle
                  center={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  radius={location.radiusKm * 1000}
                  strokeColor={Colors.light.fishBlue}
                  fillColor={Colors.light.mapCircleFill}
                  strokeWidth={2}
                />
              )}
            </MapView>
            {customRadiusEnabled && (
              <View style={styles.sliderOverlay} pointerEvents="box-none">
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
                    minimumTrackTintColor={Colors.light.fishBlue}
                    maximumTrackTintColor={Colors.light.sliderGray}
                    thumbTintColor={Colors.light.white}
                    step={1}
                  />
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Custom Radius Section */}
      <View style={styles.customRadiusContainer}>
        <View style={styles.customRadiusContent}>
          <View style={styles.customRadiusTextContainer}>
            <Text style={styles.customRadiusTitle}>Custom Radius</Text>
            <Text style={styles.customRadiusDescription}>
              Only show the listings within a specific distance
            </Text>
          </View>
          <Switch
            value={customRadiusEnabled}
            onValueChange={setCustomRadiusEnabled}
            trackColor={{
              false: Colors.light.sliderGray,
              true: Colors.light.fishBlue,
            }}
            thumbColor={Colors.light.white}
            ios_backgroundColor={Colors.light.sliderGray}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Pressable style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>
        <Pressable style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.buttonText}>Apply</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.light.eggshellWhite,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.filterBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.primaryText,
    fontFamily: Fonts.regular_400,
  },
  mapContainer: {
    width: '100%',
    marginBottom: 16,
  },
  mapWrapper: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.light.locationContainerBackground,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webMapPlaceholder: {
    padding: 20,
    textAlign: 'center',
    color: Colors.light.textSecondary,
  },
  sliderOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sliderWrapper: {
    marginBottom: 12,
  },
  radiusText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.primaryText,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Fonts.medium_500,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  customRadiusContainer: {
    marginBottom: 24,
  },
  customRadiusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customRadiusTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  customRadiusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    marginBottom: 4,
    fontFamily: Fonts.bold_700,
  },
  customRadiusDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontFamily: Fonts.regular_400,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  clearButton: {
    flex: 1,
    backgroundColor: Colors.light.fishBlue,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButton: {
    flex: 1,
    backgroundColor: Colors.light.fishBlue,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.bold_700_inter,
  },
});
