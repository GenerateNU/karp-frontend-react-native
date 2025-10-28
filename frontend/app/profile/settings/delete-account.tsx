import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { BackHeader } from '@/components/common/BackHeader';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useAuth } from '@/context/AuthContext';
import { volunteerService } from '@/services/volunteerService';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user?.entityId) {
      Alert.alert('Error', 'No volunteer profile found');
      return;
    }

    try {
      setLoading(true);
      await volunteerService.deleteVolunteer(user.entityId);

      Alert.alert(
        'Account Deleted',
        'Your account has been deleted successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              signOut();
              router.replace('/login');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <BackHeader />
        <View style={styles.content}>
          <Text style={styles.title}>
            Are you sure you want to delete your account?
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.keepButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.keepButtonText}>No, keep it!</Text>
            </Pressable>

            <Pressable
              style={[
                styles.deleteButton,
                loading && styles.deleteButtonDisabled,
              ]}
              onPress={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.light.eggshellWhite} />
              ) : (
                <Text style={styles.deleteButtonText}>Yes, delete it!</Text>
              )}
            </Pressable>
          </View>
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
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  title: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 44,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
  },
  keepButton: {
    height: 44,
    paddingHorizontal: 25,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keepButtonText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  deleteButton: {
    height: 44,
    paddingHorizontal: 25,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: '#FF6666',
  },
  deleteButtonText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.eggshellWhite,
  },
});