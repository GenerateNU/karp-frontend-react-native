import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { FormSection } from '../forms/FormSection';
import { FormField } from '../forms/FormField';
import { EventSlotSelection } from '@/components/events/EventSlotSelection';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { ThemedView } from '../ThemedView';
import { Event } from '@/types/api/event';
import { createRegistration } from '@/services/registrationService';
import { router } from 'expo-router';

interface EventSignUpFormProps {
  eventId: string;
  event: Event;
}

export function EventSignUpForm({ event }: EventSignUpFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: '',
    email: user?.email || '',
    address: '',
    selectedDate: '',
    selectedTime: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSlotSelection = (type: 'date' | 'time', value: string) => {
    setFormData(prev => ({
      ...prev,
      [type === 'date' ? 'selectedDate' : 'selectedTime']: value,
    }));
  };

  const validateForm = () => {
    const required = [
      'firstName',
      'lastName',
      'email',
      'address',
      'selectedDate',
      'selectedTime',
    ];
    const missing = required.filter(
      field => !formData[field as keyof typeof formData]
    );

    if (missing.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createRegistration(event.id);
      router.push({
        pathname: '/events/[eventId]/success',
        params: {
          eventId: event.id,
          selectedDate: formData.selectedDate,
          selectedTime: formData.selectedTime,
          duration: 2, // change to event.duration when api is ready
        },
      });
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to create registration ' + (error as Error).message
      );
    }
  };

  return (
    <ThemedView>
      <ThemedView style={styles.formContainer}>
        <FormSection title="Name:">
          <FormField
            value={formData.firstName}
            onChangeText={value => {
              handleInputChange('firstName', value);
            }}
            placeholder="First Name"
            style={styles.nameField}
          />
          <FormField
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={value => handleInputChange('lastName', value)}
            style={styles.nameField}
          />
        </FormSection>

        <FormSection title="Contact Info:">
          <FormField
            value={formData.phone}
            onChangeText={value => handleInputChange('phone', value)}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
          <FormField
            value={formData.email}
            onChangeText={value => handleInputChange('email', value)}
            placeholder="Email Address"
            keyboardType="email-address"
          />
        </FormSection>

        <FormSection title="Location:">
          <FormField
            value={formData.address}
            onChangeText={value => handleInputChange('address', value)}
            placeholder="1234 St, Boston, MA"
          />
        </FormSection>
      </ThemedView>

      <EventSlotSelection
        event={event}
        selectedDate={formData.selectedDate}
        selectedTime={formData.selectedTime}
        onDateSelect={date => handleSlotSelection('date', date)}
        onTimeSelect={time => handleSlotSelection('time', time)}
      />

      <Button
        text="CONFIRM"
        onPress={handleSubmit}
        loading={false}
        disabled={
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.address ||
          !formData.selectedDate ||
          !formData.selectedTime
        }
        buttonsStyle={styles.submitButton}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    paddingBottom: 27,
  },
  nameField: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 24,
    alignSelf: 'center',
  },
});
