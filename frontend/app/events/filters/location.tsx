import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  TextInput,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
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
  radiusMiles: number;
}

export default function LocationFilterPage() {
  const router = useRouter();
  const { locationFilter, setLocationFilter, userLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<LocationState>(() => {
    return {
      latitude: locationFilter?.latitude || DEFAULT_LOCATION.latitude,
      longitude: locationFilter?.longitude || DEFAULT_LOCATION.longitude,
      radiusMiles: locationFilter
        ? locationFilter.radiusKm * 0.621371
        : DEFAULT_LOCATION.radiusKm * 0.621371,
    };
  });
  const mapRef = useRef<MapView>(null);
  const MIN_RADIUS_MILES = 1;
  const MAX_RADIUS_MILES = 250;

  // Sets map zoom level so the search radius circle is fully visible in the viewport.
  const getLatitudeDelta = useCallback((radiusMiles: number) => {
    const radiusKm = radiusMiles * 1.60934;
    return (radiusKm * 2.5) / 111;
  }, []);

  const getLongitudeDelta = useCallback(
    (latitude: number, radiusMiles: number) => {
      const radiusKm = radiusMiles * 1.60934;
      const latRad = (latitude * Math.PI) / 180;
      return (radiusKm * 2.5) / (111 * Math.cos(latRad));
    },
    []
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
          radiusMiles: location.radiusMiles,
        };
        setLocation(newLocation);
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            latitudeDelta: getLatitudeDelta(newLocation.radiusMiles),
            longitudeDelta: getLongitudeDelta(
              newLocation.latitude,
              newLocation.radiusMiles
            ),
          });
        }
      }
    } catch {
      // Handle error silently or show a message
    }
  }, [searchQuery, location.radiusMiles, getLatitudeDelta, getLongitudeDelta]);

  useEffect(() => {
    if (locationFilter && mapRef.current) {
      const radiusMiles = locationFilter.radiusKm * 0.621371;
      setLocation({
        latitude: locationFilter.latitude,
        longitude: locationFilter.longitude,
        radiusMiles,
      });
      mapRef.current.animateToRegion({
        latitude: locationFilter.latitude,
        longitude: locationFilter.longitude,
        latitudeDelta: getLatitudeDelta(radiusMiles),
        longitudeDelta: getLongitudeDelta(locationFilter.latitude, radiusMiles),
      });
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
      const clampedRadius = Math.max(
        MIN_RADIUS_MILES,
        Math.min(MAX_RADIUS_MILES, radius)
      );
      setLocation(prev => {
        const newLocation = { ...prev, radiusMiles: clampedRadius };
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

  const handleUseCurrentLocation = useCallback(() => {
    if (userLocation && userLocation.coordinates) {
      const [longitude, latitude] = userLocation.coordinates;
      const newLocation = {
        latitude,
        longitude,
        radiusMiles: location.radiusMiles,
      };
      setLocation(newLocation);
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: getLatitudeDelta(location.radiusMiles),
          longitudeDelta: getLongitudeDelta(latitude, location.radiusMiles),
        });
      }
    }
  }, [userLocation, location.radiusMiles, getLatitudeDelta, getLongitudeDelta]);

  const handleApply = useCallback(() => {
    const radiusKm = location.radiusMiles * 1.60934;
    const locationFilterValue = {
      latitude: location.latitude,
      longitude: location.longitude,
      radiusKm: radiusKm,
    };
    setLocationFilter(locationFilterValue);
    router.back();
  }, [location, setLocationFilter, router]);

  const radiusKm = location.radiusMiles * 1.60934;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-2">
        <View className="mb-4">
          <Pressable
            onPress={() => router.back()}
            className="mb-2 flex-row items-center"
          >
            <Image
              source={require('@/assets/images/back-arrow.svg')}
              style={styles.backArrow}
              contentFit="contain"
            />
            <Text className="text-base" style={styles.backText}>
              Back
            </Text>
          </Pressable>
          <Text
            className="text-center text-lg font-semibold"
            style={styles.title}
          >
            Location:
          </Text>
        </View>
      </View>

      <View className="mb-4 px-4">
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
      </View>

      {/* Map */}
      <View className="mb-4 px-4">
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
                latitudeDelta: getLatitudeDelta(location.radiusMiles),
                longitudeDelta: getLongitudeDelta(
                  location.latitude,
                  location.radiusMiles
                ),
              }}
              onPress={handleMapPress}
              scrollEnabled={true}
              zoomEnabled={true}
              rotateEnabled={true}
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
              />
              <Circle
                center={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                radius={radiusKm * 1000}
                strokeColor={Colors.light.fishBlue}
                fillColor={Colors.light.mapCircleFill}
                strokeWidth={2}
              />
            </MapView>
            <Pressable
              style={styles.currentLocationButton}
              onPress={handleUseCurrentLocation}
            >
              <Ionicons
                name="locate"
                size={24}
                color={Colors.light.primaryText}
              />
            </Pressable>
          </View>
        )}
      </View>

      {/* Radius Slider */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.slider}
            minimumValue={MIN_RADIUS_MILES}
            maximumValue={MAX_RADIUS_MILES}
            value={Math.max(
              MIN_RADIUS_MILES,
              Math.min(MAX_RADIUS_MILES, location.radiusMiles)
            )}
            onValueChange={handleRadiusChange}
            minimumTrackTintColor={Colors.light.fishBlue}
            maximumTrackTintColor={Colors.light.sliderGray}
            thumbTintColor={Colors.light.white}
            step={1}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>{MIN_RADIUS_MILES}</Text>
            <Text style={styles.sliderLabel}>{MAX_RADIUS_MILES}</Text>
          </View>
          <View style={styles.radiusDisplay}>
            <Text style={styles.radiusText}>
              {Math.round(location.radiusMiles)} miles
            </Text>
          </View>
        </View>
      </View>

      {/* Apply Button */}
      <View className="mb-4 px-4">
        <Pressable style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backArrow: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  backText: {
    color: Colors.light.primaryText,
  },
  title: {
    fontSize: 20,
    color: Colors.light.primaryText,
    fontFamily: Fonts.bold_700,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.formInputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.primaryText,
  },
  mapWrapper: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.light.locationContainerBackground,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  currentLocationButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    padding: 8,
    shadowColor: Colors.light.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  webMapPlaceholder: {
    padding: 20,
    textAlign: 'center',
    color: Colors.light.textSecondary,
  },
  sliderContainer: {
    backgroundColor: Colors.light.sliderContainerBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'visible',
  },
  sliderWrapper: {
    width: '100%',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  sliderLabel: {
    fontSize: 12,
    color: Colors.light.primaryText,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
    overflow: 'visible',
  },
  radiusDisplay: {
    marginTop: 4,
    alignItems: 'center',
    backgroundColor: Colors.light.radiusDisplayBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'center',
  },
  radiusText: {
    fontSize: 14,
    color: Colors.light.primaryText,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: Colors.light.filterButtonBackground,
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  applyButtonText: {
    color: Colors.light.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});
