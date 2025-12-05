import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSignUp } from '@/context/SignUpContext';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Image } from 'expo-image';
import { router, usePathname } from 'expo-router';
import { SignUpFlowButton } from '@/components/signup/SignUpFlowButton';
import { SignUpProgress } from '@/components/signup/SignUpProgress';

function SignUpBirthday() {
  const pathname = usePathname();
  const isIndexPage = pathname === '/signup';
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
      router.push('/signup/preferences');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/birthday.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        pointerEvents="none"
      />
      {!isIndexPage && <SignUpProgress />}
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
    paddingTop: 75,
    paddingBottom: 100,
  },
  header: {
    marginTop: 50,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    color: Colors.light.text,
    fontFamily: Fonts.bold_700,
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
    bottom: 20,
    left: 0,
    right: 0,
    padding: 20,
  },
});
