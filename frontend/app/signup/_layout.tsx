import React from 'react';
import { Stack } from 'expo-router';
import { SignUpProvider } from '@/context/SignUpContext';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function SignUpLayout() {
  return (
    <SignUpProvider>
      <View style={styles.safeAreaView}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="personal" />
          <Stack.Screen name="birthday" />
          <Stack.Screen name="preferences" />
          <Stack.Screen name="qualifications" />
          <Stack.Screen name="volunteer-days" />
        </Stack>
      </View>
    </SignUpProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.light.white,
  },
});
