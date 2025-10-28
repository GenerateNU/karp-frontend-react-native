import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSignUp } from '@/context/SignUpContext';
import { Colors } from '@/constants/Colors';
import { RelativePathString, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export function SignUpProgress() {
  const { currentStep } = useSignUp();
  const router = useRouter();

  const handleBack = () => {
    const routeMap: Record<number, string> = {
      1: '/signup',
      2: '/signup',
      3: '/signup/personal',
      4: '/signup/birthday',
      5: '/signup/preferences',
      6: '/signup/qualifications',
    };

    const previousRoute = routeMap[currentStep];
    if (previousRoute) {
      router.push(previousRoute as RelativePathString);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressLine}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentStep - 1) / 5) * 100}%` },
            ]}
          />
        </View>

        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.light.transparent,
  },
  progressContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.transparent,
  },
  progressLine: {
    width: 275,
    height: 4,
    backgroundColor: Colors.light.inputBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.fishBlue,
    borderRadius: 2,
  },
});
