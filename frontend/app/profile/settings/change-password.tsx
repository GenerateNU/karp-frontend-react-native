import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { BackHeader } from '@/components/common/BackHeader';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { userService } from '@/services/userService';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await userService.resetPassword({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      });

      Alert.alert('Success', 'Password changed successfully', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error changing password:', error);
      const message = error?.response?.data?.detail || 'Failed to change password';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <BackHeader />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Change Password</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Current Password<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Enter current password"
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              New Password<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Enter new password"
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>

          <Pressable
            style={[styles.changeButton, loading && styles.changeButtonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.light.text} />
            ) : (
              <Text style={styles.changeButtonText}>Change Password</Text>
            )}
          </Pressable>
        </ScrollView>
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
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 40,
  },
  title: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 26,
  },
  fieldContainer: {
    marginBottom: 22,
  },
  label: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 10,
  },
  required: {
    color: '#FF0000',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontFamily: Fonts.light_300,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.eggshellWhite,
  },
  changeButton: {
    height: 44,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },
  changeButtonDisabled: {
    backgroundColor: Colors.light.disabledButton,
  },
  changeButtonText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
});