import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSignUp } from '@/context/SignUpContext';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { SignUpFlowButton } from '@/components/signup/SignUpFlowButton';
import { GradeLevel } from '@/types/api/volunteer';
import { Picker } from '@react-native-picker/picker';

function SignUpGradeLevel() {
  const { data, setData, setCurrentStep, setError, clearErrors } = useSignUp();
  const router = useRouter();

  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | null>(
    data.gradeLevel || null
  );

  const gradeLevels = [
    GradeLevel.SIXTH_GRADE,
    GradeLevel.SEVENTH_GRADE,
    GradeLevel.EIGHTH_GRADE,
    GradeLevel.NINTH_GRADE,
    GradeLevel.TENTH_GRADE,
    GradeLevel.ELEVENTH_GRADE,
    GradeLevel.TWELFTH_GRADE,
    GradeLevel.UNDERGRADUATE,
    GradeLevel.MASTERS,
    GradeLevel.PHD,
  ];

  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    if (!selectedGrade) {
      setError('gradeLevel', 'Please select your grade level');
      isValid = false;
    }

    return isValid;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setData({ gradeLevel: selectedGrade as GradeLevel });
      router.push('/signup/preferences');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What grade are you in?</Text>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedGrade}
          onValueChange={itemValue => setSelectedGrade(itemValue)}
        >
          <Picker.Item label="Select your grade level" value={null} />
          {gradeLevels.map(grade => (
            <Picker.Item key={grade} label={grade} value={grade} />
          ))}
        </Picker>
      </View>

      <View style={styles.fixedButtonContainer}>
        <SignUpFlowButton
          onPress={handleContinue}
          text="Continue"
          variant="fixed"
          disabled={!selectedGrade}
        />
      </View>
    </View>
  );
}

export default function SignUpGradeLevelScreen() {
  return <SignUpGradeLevel />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
    paddingHorizontal: 50,
    paddingTop: 75,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    color: Colors.light.text,
    fontFamily: Fonts.medium_500,
    textAlign: 'center',
  },
  pickerContainer: {
    flex: 1,
    marginBottom: 20,
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
