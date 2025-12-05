import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import {
  EventFilters,
  EventSortOption,
  EventCause,
  EventQualification,
  EventAvailabilityDay,
  EVENT_SORT_OPTIONS,
  EVENT_CAUSES,
  EVENT_QUALIFICATIONS,
  EVENT_AVAILABILITY_DAYS,
} from '@/types/api/event';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useLocation } from '@/context/LocationContext';
import { useEventFilters } from '@/context/EventFiltersContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const CAUSE_EMOJIS: Record<EventCause, string> = {
  Animals: '🐾',
  'Arts & Culture': '🎨',
  'Climate Change': '🌳',
  Community: '👥',
  Disability: '♿',
  'Disaster Relief': '🏡',
  Education: '🎓',
  'Food Security': '🍲',
  'Health & Medicine': '🚑',
  'Human Rights': '✊',
  'Mental Health': '🧠',
  Poverty: '💵',
  Research: '📖',
  'Seniors & Retirement': '👴',
};

const QUALIFICATION_EMOJIS: Record<EventQualification, string> = {
  'Club Leader/Member': '👥',
  'Camp Counselor': '🏕️',
  'Event Volunteer/Organizer': '📅',
  'Environment Project': '🌳',
  'First Aid Certified': '🚑',
  'Food Safety Certified': '🍽️',
  'Google/Microsoft Tools': '💻',
  'Graphic Design': '🎨',
  'Lifeguard Certified': '🏊',
  'STEM or Robotics': '🔬',
  'Student Council': '🗣️',
};

export default function EventFiltersPage() {
  const router = useRouter();
  const { locationFilter } = useLocation();
  const { filters: contextFilters, setFilters: setContextFilters } =
    useEventFilters();
  const [locationDisplayName, setLocationDisplayName] =
    useState<string>('Loading...');
  const [selectedSort, setSelectedSort] = useState<EventSortOption | null>(
    contextFilters.sort_by || null
  );
  const [selectedCauses, setSelectedCauses] = useState<EventCause[]>(
    contextFilters.causes || []
  );
  const [selectedQualifications, setSelectedQualifications] = useState<
    EventQualification[]
  >(contextFilters.qualifications || []);
  const [selectedAvailabilityDays, setSelectedAvailabilityDays] = useState<
    EventAvailabilityDay[]
  >(contextFilters.availabilityDays || []);
  const [availabilityStartTime, setAvailabilityStartTime] = useState<Date>(
    () => {
      if (contextFilters.availabilityStartTime) {
        const [hours, minutes] =
          contextFilters.availabilityStartTime.split(':');
        return new Date(2024, 0, 1, parseInt(hours), parseInt(minutes));
      }
      return new Date(2024, 0, 1, 15, 0);
    }
  );
  const [availabilityEndTime, setAvailabilityEndTime] = useState<Date>(() => {
    if (contextFilters.availabilityEndTime) {
      const [hours, minutes] = contextFilters.availabilityEndTime.split(':');
      return new Date(2024, 0, 1, parseInt(hours), parseInt(minutes));
    }
    return new Date(2024, 0, 1, 17, 0);
  });
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    setSelectedSort(contextFilters.sort_by || null);
    setSelectedCauses(contextFilters.causes || []);
    setSelectedQualifications(contextFilters.qualifications || []);
    setSelectedAvailabilityDays(contextFilters.availabilityDays || []);
    if (contextFilters.availabilityStartTime) {
      const [hours, minutes] = contextFilters.availabilityStartTime.split(':');
      setAvailabilityStartTime(
        new Date(2024, 0, 1, parseInt(hours), parseInt(minutes))
      );
    }
    if (contextFilters.availabilityEndTime) {
      const [hours, minutes] = contextFilters.availabilityEndTime.split(':');
      setAvailabilityEndTime(
        new Date(2024, 0, 1, parseInt(hours), parseInt(minutes))
      );
    }
  }, [contextFilters]);

  useEffect(() => {
    const reverseGeocode = async () => {
      if (!locationFilter) {
        setLocationDisplayName('No location set');
        return;
      }

      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: locationFilter.latitude,
          longitude: locationFilter.longitude,
        });

        if (addresses && addresses.length > 0) {
          const address = addresses[0];
          const city = address.city || address.subregion || '';
          const state = address.region || '';
          if (city && state) {
            setLocationDisplayName(`${city}, ${state}`);
          } else if (city) {
            setLocationDisplayName(city);
          } else if (state) {
            setLocationDisplayName(state);
          } else {
            setLocationDisplayName('Unknown location');
          }
        } else {
          setLocationDisplayName('Unknown location');
        }
      } catch {
        setLocationDisplayName('Unknown location');
      }
    };

    reverseGeocode();
  }, [locationFilter]);

  const handleApply = () => {
    const filters: EventFilters = {};

    if (selectedSort === 'new_additions') {
      filters.sort_by = 'new_additions';
    } else if (selectedSort === 'coins_low_to_high') {
      filters.sort_by = 'coins_low_to_high';
    } else if (selectedSort === 'coins_high_to_low') {
      filters.sort_by = 'coins_high_to_low';
    } else if (selectedSort === 'been_before') {
      filters.sort_by = 'been_before';
    }

    if (selectedCauses.length > 0) {
      filters.causes = selectedCauses;
    }
    if (selectedQualifications.length > 0) {
      filters.qualifications = selectedQualifications;
    }

    if (selectedAvailabilityDays.length > 0) {
      filters.availabilityDays = selectedAvailabilityDays;
      const startHours = String(availabilityStartTime.getHours()).padStart(
        2,
        '0'
      );
      const startMinutes = String(availabilityStartTime.getMinutes()).padStart(
        2,
        '0'
      );
      const endHours = String(availabilityEndTime.getHours()).padStart(2, '0');
      const endMinutes = String(availabilityEndTime.getMinutes()).padStart(
        2,
        '0'
      );
      filters.availabilityStartTime = `${startHours}:${startMinutes}`;
      filters.availabilityEndTime = `${endHours}:${endMinutes}`;
    }

    setContextFilters(filters);
    router.back();
  };

  const toggleCause = (cause: EventCause) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(prev => prev.filter(c => c !== cause));
    } else if (selectedCauses.length < 5) {
      setSelectedCauses(prev => [...prev, cause]);
    }
  };

  const toggleQualification = (qual: EventQualification) => {
    if (selectedQualifications.includes(qual)) {
      setSelectedQualifications(prev => prev.filter(q => q !== qual));
    } else {
      setSelectedQualifications(prev => [...prev, qual]);
    }
  };

  const toggleAvailabilityDay = (day: EventAvailabilityDay) => {
    if (selectedAvailabilityDays.includes(day)) {
      const newDays = selectedAvailabilityDays.filter(d => d !== day);
      setSelectedAvailabilityDays(newDays);
      // Close time picker if no days are selected
      if (newDays.length === 0) {
        setShowStartTimePicker(false);
        setShowEndTimePicker(false);
      }
    } else {
      setSelectedAvailabilityDays(prev => [...prev, day]);
    }
  };

  const handleClear = () => {
    setSelectedSort(null);
    setSelectedCauses([]);
    setSelectedQualifications([]);
    setSelectedAvailabilityDays([]);
    setAvailabilityStartTime(new Date(2024, 0, 1, 15, 0));
    setAvailabilityEndTime(new Date(2024, 0, 1, 17, 0));
    setShowStartTimePicker(false);
    setShowEndTimePicker(false);
    setContextFilters({});
  };

  const formatTime12Hour = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes}${ampm}`;
  };

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
            style={styles.filtersTitle}
          >
            Filters:
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Sort Section */}
        <View className="mb-6 px-6">
          <Text
            className="mb-3 text-base font-semibold"
            style={styles.sectionTitle}
          >
            Sort
          </Text>
          <View className="space-y-2">
            {EVENT_SORT_OPTIONS.map(sortOption => {
              const isSelected = selectedSort === sortOption;
              const labels: Record<EventSortOption, string> = {
                recommendations: 'Recommendations',
                been_before: 'Been Before',
                new_additions: 'New Additions',
                coins_low_to_high: 'Koins (Lowest to Highest)',
                coins_high_to_low: 'Koins (Highest to Lowest)',
              };
              return (
                <Pressable
                  key={sortOption}
                  onPress={() =>
                    setSelectedSort(isSelected ? null : sortOption)
                  }
                  className="flex-row items-center justify-between py-3"
                >
                  <Text className="text-base" style={styles.sortOptionText}>
                    {labels[sortOption]}
                  </Text>
                  <View
                    style={[
                      styles.sortCheckbox,
                      isSelected && styles.sortCheckboxChecked,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={Colors.light.white}
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mb-6 px-6">
          <Text
            className="mb-2 text-base font-semibold"
            style={styles.sectionTitle}
          >
            Causes (Pick up to 5)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {EVENT_CAUSES.map(cause => {
              const isSelected = selectedCauses.includes(cause);
              const isDisabled = !isSelected && selectedCauses.length >= 5;
              return (
                <Pressable
                  key={cause}
                  onPress={() => toggleCause(cause)}
                  disabled={isDisabled}
                  className={`flex-row items-center rounded-lg border px-3 py-2 ${
                    isSelected
                      ? 'border-blue-500'
                      : isDisabled
                        ? 'border-gray-200 opacity-50'
                        : 'border-gray-200'
                  }`}
                  style={
                    isSelected ? styles.causeButtonSelected : styles.causeButton
                  }
                >
                  <Text className="mr-2 text-base">{CAUSE_EMOJIS[cause]}</Text>
                  <Text className="text-sm" style={styles.causeLabel}>
                    {cause}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mb-6 px-6">
          <Text
            className="mb-2 text-base font-semibold"
            style={styles.sectionTitle}
          >
            Qualifications
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {EVENT_QUALIFICATIONS.map(qual => {
              const isSelected = selectedQualifications.includes(qual);
              return (
                <Pressable
                  key={qual}
                  onPress={() => toggleQualification(qual)}
                  className={`flex-row items-center rounded-lg border px-3 py-2 ${
                    isSelected ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  style={
                    isSelected
                      ? styles.qualificationButtonSelected
                      : styles.qualificationButton
                  }
                >
                  <Text className="mr-2 text-base">
                    {QUALIFICATION_EMOJIS[qual]}
                  </Text>
                  <Text className="text-sm" style={styles.qualificationLabel}>
                    {qual}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mb-6 px-6">
          <Text
            className="mb-3 text-base font-semibold"
            style={styles.sectionTitle}
          >
            Availability (Days/times you&apos;re available)
          </Text>

          <View className="mb-4">
            {EVENT_AVAILABILITY_DAYS.map(day => {
              const isSelected = selectedAvailabilityDays.includes(day);
              return (
                <View key={day} style={styles.dayRow}>
                  <Pressable
                    onPress={() => toggleAvailabilityDay(day)}
                    style={[
                      styles.dayCheckbox,
                      isSelected && styles.dayCheckboxChecked,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={Colors.light.white}
                      />
                    )}
                  </Pressable>
                  <Text style={styles.dayText}>{day}</Text>
                </View>
              );
            })}
          </View>

          {selectedAvailabilityDays.length > 0 && (
            <View className="mb-4">
              <Text
                className="mb-2 text-sm font-medium"
                style={styles.sectionTitle}
              >
                Time Range (applies to all selected days)
              </Text>
              <View style={styles.timeRangeContainer}>
                <Pressable
                  onPress={() => {
                    if (showStartTimePicker) {
                      setShowStartTimePicker(false);
                    } else {
                      setShowEndTimePicker(false);
                      setShowStartTimePicker(true);
                    }
                  }}
                  style={styles.timeButton}
                >
                  <Text style={styles.timeButtonText}>
                    {formatTime12Hour(availabilityStartTime)}
                  </Text>
                </Pressable>
                <Text style={styles.timeSeparator}>-</Text>
                <Pressable
                  onPress={() => {
                    if (showEndTimePicker) {
                      setShowEndTimePicker(false);
                    } else {
                      setShowStartTimePicker(false);
                      setShowEndTimePicker(true);
                    }
                  }}
                  style={styles.timeButton}
                >
                  <Text style={styles.timeButtonText}>
                    {formatTime12Hour(availabilityEndTime)}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <View className="mb-6 px-6">
          <Text
            className="mb-3 text-base font-semibold"
            style={styles.sectionTitle}
          >
            Location (find events by location radius)
          </Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationInfoContainer}>
              <Ionicons
                name="location"
                size={20}
                color={Colors.light.primaryText}
                style={styles.locationIcon}
              />
              <Text style={styles.locationText}>{locationDisplayName}</Text>
            </View>
            <Pressable
              onPress={() => router.push('/events/filters/location')}
              style={styles.changeLocationButton}
            >
              <Text style={styles.changeLocationText}>Change Location</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={Colors.light.primaryText}
              />
            </Pressable>
          </View>
        </View>

        {/* Clear and Apply Buttons */}
        <View className="px-6 py-4">
          <View style={styles.buttonContainer}>
            <Pressable onPress={handleClear} style={styles.clearButton}>
              <Text style={styles.buttonText}>Clear</Text>
            </Pressable>
            <Pressable onPress={handleApply} style={styles.applyButton}>
              <Text style={styles.buttonText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showStartTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStartTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowStartTimePicker(false)}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Start Time</Text>
            <DateTimePicker
              value={availabilityStartTime}
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  setAvailabilityStartTime(selectedTime);
                }
                if (Platform.OS === 'android' && event.type === 'dismissed') {
                  setShowStartTimePicker(false);
                }
              }}
            />
            <Pressable
              onPress={() => setShowStartTimePicker(false)}
              style={styles.modalDoneButton}
            >
              <Text style={styles.modalDoneButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEndTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEndTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowEndTimePicker(false)}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select End Time</Text>
            <DateTimePicker
              value={availabilityEndTime}
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  setAvailabilityEndTime(selectedTime);
                }
                if (Platform.OS === 'android' && event.type === 'dismissed') {
                  setShowEndTimePicker(false);
                }
              }}
            />
            <Pressable
              onPress={() => setShowEndTimePicker(false)}
              style={styles.modalDoneButton}
            >
              <Text style={styles.modalDoneButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  filtersTitle: {
    fontSize: 20,
    color: Colors.light.primaryText,
    fontFamily: Fonts.bold_700,
  },
  sectionTitle: {
    color: Colors.light.primaryText,
  },
  sortOptionText: {
    color: Colors.light.primaryText,
  },
  causeLabel: {
    color: Colors.light.primaryText,
  },
  qualificationLabel: {
    color: Colors.light.primaryText,
  },
  causeButton: {
    backgroundColor: Colors.light.transparent,
  },
  causeButtonSelected: {
    backgroundColor: Colors.light.moreInfoButton,
  },
  qualificationButton: {
    backgroundColor: Colors.light.transparent,
  },
  qualificationButtonSelected: {
    backgroundColor: Colors.light.moreInfoButton,
  },
  dayCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.light.primaryText,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCheckboxChecked: {
    backgroundColor: Colors.light.primaryText,
  },
  sortCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.primaryText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortCheckboxChecked: {
    backgroundColor: Colors.light.primaryText,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayText: {
    flex: 1,
    color: Colors.light.primaryText,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeButton: {
    backgroundColor: Colors.light.filterActiveBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
  },
  timeButtonText: {
    color: Colors.light.primaryText,
    fontSize: 14,
  },
  timeSeparator: {
    color: Colors.light.primaryText,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.light.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 20,
    minWidth: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.light.primaryText,
  },
  modalDoneButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: Colors.light.filterBlue,
    borderRadius: 8,
  },
  modalDoneButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.locationContainerBackground,
    borderRadius: 8,
    padding: 12,
  },
  locationInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    color: Colors.light.primaryText,
    fontSize: 14,
    fontWeight: '500',
  },
  changeLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.moreInfoButton,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeLocationText: {
    color: Colors.light.primaryText,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: Colors.light.filterButtonBackground,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyButton: {
    flex: 1,
    backgroundColor: Colors.light.filterButtonBackground,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.light.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});
