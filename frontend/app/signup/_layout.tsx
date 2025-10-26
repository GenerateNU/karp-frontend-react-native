import React from 'react';
import { Stack, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignUpProvider } from '@/context/SignUpContext';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SignUpProgress } from '@/components/signup/SignUpProgress';

export default function SignUpLayout() {
  const pathname = usePathname();
  const isIndexPage = pathname === '/signup';

  return (
    <SignUpProvider>
      <SafeAreaView style={styles.safeAreaView}>
        {!isIndexPage && <SignUpProgress />}
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="personal" />
          <Stack.Screen name="birthday" />
          <Stack.Screen name="grade-level" />
          <Stack.Screen name="preferences" />
          <Stack.Screen name="qualifications" />
          <Stack.Screen name="volunteer-days" />
        </Stack>
      </SafeAreaView>
    </SignUpProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.light.white,
  },
});
