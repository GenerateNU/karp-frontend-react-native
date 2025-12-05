import React, { useState, useEffect } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/types/api/event';
import { eventService } from '@/services/eventService';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import { createRegistration } from '@/services/registrationService';

export default function EventSignUpPage() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const backgroundImage = require('@/assets/images/event-signup.png');

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    const fetchEventDetails = async () => {
      try {
        const eventData = await eventService.getEventById(eventId as string);
        setEvent(eventData);
      } catch (error) {
        console.log('Error fetching event details:', error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, isAuthenticated, router]);

  if (loading) {
    return <LoadingScreen text="Loading event sign-up details..." />;
  }

  const handleConfirm = async () => {
    if (!event?.id) return;

    try {
      setSubmitting(true);
      await createRegistration(event.id);
      router.push({
        pathname: '/events/[eventId]/success',
        params: {
          eventId: event.id,
        },
      });
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to create registration: ' + (error as Error).message
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen text="Loading event sign-up details..." />;
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
      </SafeAreaView>
    );
  }

  const start = event?.startDateTime ? new Date(event.startDateTime) : null;
  const end = event?.endDateTime ? new Date(event.endDateTime) : null;

  const dateFormatted = start
    ? start.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
      })
    : '';

  const timeFormatted =
    start && end
      ? `${start.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
        })} - ${end.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
        })}`
      : '';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={backgroundImage}
        style={StyleSheet.absoluteFillObject}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#1D0F48" />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.dateSection}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color="#1D0F48"
                  style={{ marginRight: 8, marginBottom: 8 }}
                />
                <Text style={styles.sectionLabel}>Date:</Text>
                <Text style={[styles.dateValue, { marginLeft: 8 }]}>
                  {dateFormatted}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color="#1D0F48"
                  style={{ marginRight: 8, marginBottom: 8 }}
                />
                <Text style={[styles.sectionLabel]}>Time:</Text>
                <Text style={[styles.dateValue, { marginLeft: 8 }]}>
                  {timeFormatted}
                </Text>
              </View>
            </View>
            <Pressable
              style={[
                styles.confirmButton,
                submitting && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#1D0F48" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm</Text>
              )}
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 39,
    paddingVertical: 15,
    gap: 8,
  },
  backText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '400',
    color: '#1D0F48',
  },
  title: {
    fontFamily: 'Ubuntu',
    fontSize: 44,
    fontWeight: '700',
    color: '#1D0F48',
    paddingHorizontal: 39,
    marginBottom: 59,
    marginTop: 36.5,
  },
  dateSection: {
    paddingHorizontal: 39,
    marginBottom: 400,
  },
  sectionLabel: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    color: '#1D0F48',
    marginBottom: 8,
  },
  dateValue: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '400',
    color: '#1D0F48',
    marginBottom: 8,
  },
  confirmButton: {
    backgroundColor: '#74C0EB',
    borderRadius: 16.333,
    paddingVertical: 12,
    alignItems: 'center',
    alignSelf: 'center',
    width: 195,
    height: 45,
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  confirmButtonText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#1D0F48',
  },
  errorText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
});
