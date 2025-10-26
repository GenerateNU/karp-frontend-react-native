import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSignUp } from '@/context/SignUpContext';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { router } from 'expo-router';
import { SignUpFlowButton } from '@/components/signup/SignUpFlowButton';

function SignUpBirthday() {
  const { data, setData, setCurrentStep, errors, setError, clearErrors } =
    useSignUp();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    setCurrentStep(3);

    if (data.birthday) {
      const [year, month, day] = data.birthday.split('-').map(Number);
      setSelectedDate(new Date(year, month - 1, day));
    }
  }, [setCurrentStep, data.birthday]);

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();

    if (age < 13) {
      setError('birthday', 'You must be at least 13 years old to sign up');
      isValid = false;
    } else if (selectedDate > today) {
      setError('birthday', 'Birthday cannot be in the future');
      isValid = false;
    }

    return isValid;
  };

  const handleDateChange = (event: unknown, date?: Date) => {
    if (date) {
      setSelectedDate(date);
      validateForm();
    }
  };

  const handleContinue = () => {
    if (validateForm()) {
      const year = selectedDate.getUTCFullYear();
      const month = selectedDate.getUTCMonth() + 1;
      const day = selectedDate.getUTCDate();

      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      setData({ ...data, birthday: formattedDate });
      router.push('/signup/grade-level');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>When is your birthday?</Text>
      </View>

      <View style={styles.dateContainer}>
        <DateTimePicker
          value={selectedDate}
          mode="date"
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      </View>
      {errors.birthday && (
        <Text style={styles.errorText}>{errors.birthday}</Text>
      )}

      <View style={styles.fixedButtonContainer}>
        <SignUpFlowButton
          onPress={handleContinue}
          text="Continue"
          variant="fixed"
        />
      </View>
    </View>
  );
}

export default function SignUpBirthdayScreen() {
  return <SignUpBirthday />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
    paddingHorizontal: 50,
    paddingTop: 25,
    paddingBottom: 100,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: Colors.light.text,
    fontFamily: Fonts.medium_500,
    textAlign: 'center',
  },
  dateContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.errorText,
    textAlign: 'center',
    marginBottom: 16,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.light.white,
  },
});
