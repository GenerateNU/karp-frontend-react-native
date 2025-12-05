import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSignUp } from '@/context/SignUpContext';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Image } from 'expo-image';
import { SignUpFlowButton } from '@/components/signup/SignUpFlowButton';
import { DayOfWeek } from '@/types/api/volunteer';
import { usePathname } from 'expo-router';
import { SignUpProgress } from '@/components/signup/SignUpProgress';

function SignUpVolunteerDays() {
  const pathname = usePathname();
  const isIndexPage = pathname === '/signup';
  const { data, setData, setCurrentStep, submitSignUp } = useSignUp();

  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(
    data.preferredDays || []
  );
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const daysOfWeek = [
    { day: DayOfWeek.SUNDAY, label: 'SUN' },
    { day: DayOfWeek.MONDAY, label: 'MON' },
    { day: DayOfWeek.TUESDAY, label: 'TUE' },
    { day: DayOfWeek.WEDNESDAY, label: 'WED' },
    { day: DayOfWeek.THURSDAY, label: 'THU' },
    { day: DayOfWeek.FRIDAY, label: 'FRI' },
    { day: DayOfWeek.SATURDAY, label: 'SAT' },
  ];

  useEffect(() => {
    setCurrentStep(6);
  }, [setCurrentStep]);

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleDone = () => {
    setData({ preferredDays: selectedDays });
    setShouldSubmit(true);
  };

  useEffect(() => {
    if (shouldSubmit) {
      submitSignUp();
      setShouldSubmit(false);
    }
  }, [shouldSubmit, submitSignUp]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/volunteer-days.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        pointerEvents="none"
      />
      {!isIndexPage && <SignUpProgress />}
      <View style={styles.header}>
        <Text style={styles.title}>
          What day(s) do you prefer to volunteer?
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.daysGrid}>
          {daysOfWeek.map(dayOption => {
            const isSelected = selectedDays.includes(dayOption.day);
            return (
              <TouchableOpacity
                key={dayOption.day}
                style={[
                  styles.dayButton,
                  isSelected && styles.selectedDayButton,
                ]}
                onPress={() => toggleDay(dayOption.day)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.dayText, isSelected && styles.selectedDayText]}
                >
                  {dayOption.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <SignUpFlowButton onPress={handleDone} text="Done" variant="fixed" />
      </View>
    </View>
  );
}

export default function SignUpVolunteerDaysScreen() {
  return <SignUpVolunteerDays />;
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
    alignItems: 'center',
    marginHorizontal: 40,
  },
  title: {
    fontSize: 24,
    color: Colors.light.text,
    fontFamily: Fonts.bold_700,
    textAlign: 'center',
    marginBottom: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  dayButton: {
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayButton: {
    backgroundColor: Colors.light.fishBlue,
    borderColor: Colors.light.fishBlue,
  },
  dayText: {
    fontSize: 12,
    color: Colors.light.text,
    fontFamily: Fonts.medium_500,
  },
  selectedDayText: {
    color: Colors.light.white,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    padding: 20,
  },
});
