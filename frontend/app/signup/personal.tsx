import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSignUp } from '@/context/SignUpContext';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { SignUpFlowButton } from '@/components/signup/SignUpFlowButton';
import { SignUpFlowInput } from '@/components/signup/SignUpFlowInput';

function SignUpPersonal() {
  const { data, setData, setCurrentStep, errors, setError, clearErrors } =
    useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState(data.firstName || '');
  const [lastName, setLastName] = useState(data.lastName || '');
  const [preferredName, setPreferredName] = useState(data.preferredName || '');

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    if (!firstName.trim()) {
      setError('firstName', 'First name is required');
      isValid = false;
    }

    if (!lastName.trim()) {
      setError('lastName', 'Last name is required');
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      setData({ firstName, lastName, preferredName });
      router.push('/signup/birthday');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What is your name?</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <SignUpFlowInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            autoCapitalize="words"
            autoCorrect={false}
            error={errors.firstName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <SignUpFlowInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            autoCapitalize="words"
            autoCorrect={false}
            error={errors.lastName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preferred Name</Text>
          <SignUpFlowInput
            value={preferredName}
            onChangeText={setPreferredName}
            placeholder="Preferred Name (Optional)"
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.fixedButtonContainer}>
        <SignUpFlowButton
          onPress={handleNext}
          text="Continue"
          variant="fixed"
          style={styles.continueButton}
        />
      </View>
    </View>
  );
}

export default function SignUpPersonalScreen() {
  return <SignUpPersonal />;
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
    fontSize: 24,
    color: Colors.light.text,
    fontFamily: Fonts.bold_700,
    marginBottom: 8,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.medium_500,
    color: Colors.light.text,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.light.white,
  },
  continueButton: {
    width: '85%',
  },
});
