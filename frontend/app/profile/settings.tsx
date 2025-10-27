import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { BackHeader } from '@/components/common/BackHeader';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <BackHeader />
        <View style={styles.content}>
          <Text style={styles.title}>Settings</Text>
          </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.eggshellWhite,
  },
  content: {
    paddingHorizontal: 34,
    paddingTop: 20,
  },
  title: {
    fontFamily: Fonts.regular_400,
    fontSize: 44,
    color: Colors.light.text,
    marginBottom: 16,
  },
});