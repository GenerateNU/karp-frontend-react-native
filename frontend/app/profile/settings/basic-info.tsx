import React, { useState, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useQueryClient } from '@tanstack/react-query';
import { BackHeader } from '@/components/common/BackHeader';
import { useAuth } from '@/context/AuthContext';
import { volunteerService } from '@/services/volunteerService';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { BoatFooter } from '@/components/profile/BoatFoater';

const GRADE_LEVELS = [
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  'Undergraduate',
  'Masters',
];

export default function BasicInfoScreen() {
  const router = useRouter();
  const { user, volunteer, fetchUserEntity } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade');

  useEffect(() => {
    if (volunteer) {
      setFirstName(volunteer.firstName || '');
      setLastName(volunteer.lastName || '');
      if (volunteer.phone) setPhone(volunteer.phone);
    }
    if (user) {
      setEmail(user.email || '');
    }
  }, [volunteer, user]);

  const handlePickProfilePhoto = async () => {
    try {
      setUploadingImage(true);
      // Request media library permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'We need access to your photos to set a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      const uri = asset.uri;
      const filetype = asset.mimeType || 'image/jpeg';
      const filenameFromUri = uri.split('/').pop() || 'profile.jpg';
      const filename = asset.fileName || filenameFromUri;

      // Get a presigned upload URL from backend (also stores S3 key)
      const { uploadUrl } = await volunteerService.getProfilePictureUploadUrl(
        filename,
        filetype
      );

      // Read file and upload to S3 using the presigned URL
      const fileResponse = await fetch(uri);
      const blob = await fileResponse.blob();

      const putResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': filetype,
        },
        body: blob,
      });

      if (!putResponse.ok) {
        throw new Error(`Upload failed with status ${putResponse.status}`);
      }

      // Invalidate profile image queries so UIs refresh
      if (user?.entityId) {
        queryClient.invalidateQueries({
          queryKey: ['volunteerProfileImage', user.entityId],
          exact: true,
        });
      }

      Alert.alert('Success', 'Profile photo updated.');
    } catch (err) {
      console.error('Error uploading profile photo:', err);
      Alert.alert('Error', 'Failed to upload profile photo. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Validation Error', 'First name and last name are required');
      return;
    }

    if (!user?.entityId) {
      Alert.alert('Error', 'No volunteer profile found');
      return;
    }

    try {
      setLoading(true);
      await volunteerService.updateVolunteer(user.entityId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
      });
      // Invalidate current volunteer to refresh any screens using the query
      queryClient.invalidateQueries({
        queryKey: ['volunteer', 'me'],
        exact: true,
      });

      try {
        await fetchUserEntity();
      } catch {}

      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
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
          <Text style={styles.title}>Basic info</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.nameRow}>
              <TextInput
                style={[styles.input, styles.nameInput]}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First"
                placeholderTextColor={Colors.light.textSecondary}
              />
              <TextInput
                style={[styles.input, styles.nameInput]}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={email}
              editable={false}
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="(123) 456-7890"
              keyboardType="phone-pad"
              placeholderTextColor={Colors.light.textSecondary}
            />
            <Text style={styles.helperText}></Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Grade Level</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setShowGradeDropdown(!showGradeDropdown)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  gradeLevel === 'Grade' && styles.placeholderText,
                ]}
              >
                {gradeLevel}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={Colors.light.text}
              />
            </Pressable>

            {showGradeDropdown && (
              <View style={styles.dropdownMenu}>
                {GRADE_LEVELS.map(grade => (
                  <Pressable
                    key={grade}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setGradeLevel(grade);
                      setShowGradeDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{grade}</Text>
                  </Pressable>
                ))}
              </View>
            )}
            <Text style={styles.helperText}></Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Profile Photo</Text>
            <View style={styles.photoContainer}>
              <Pressable
                style={styles.browseButton}
                disabled={uploadingImage}
                onPress={handlePickProfilePhoto}
              >
                {uploadingImage ? (
                  <ActivityIndicator color={Colors.light.textSecondary} />
                ) : (
                  <Text style={styles.browseButtonText}>Browse images</Text>
                )}
              </Pressable>
            </View>
            <Text style={styles.helperText}></Text>
          </View>

          <Pressable
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.light.eggshellWhite} />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </Pressable>
        </ScrollView>
        <BoatFooter />
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
    marginBottom: 26,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 26,
  },
  label: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 10,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 10,
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
  nameInput: {
    flex: 1,
  },
  readOnlyInput: {
    backgroundColor: '#F5F5F5',
    color: Colors.light.textSecondary,
  },
  dropdown: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.eggshellWhite,
  },
  dropdownText: {
    fontFamily: Fonts.light_300,
    fontSize: 16,
    color: Colors.light.text,
  },
  placeholderText: {
    color: Colors.light.textSecondary,
  },
  dropdownMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    borderRadius: 8,
    backgroundColor: Colors.light.eggshellWhite,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dropdownItemText: {
    fontFamily: Fonts.light_300,
    fontSize: 16,
    color: Colors.light.text,
  },
  photoContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.light.cardBorder,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    gap: 15,
  },
  browseButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  browseButtonText: {
    fontFamily: Fonts.light_300,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  helperText: {
    fontFamily: Fonts.light_300,
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 6,
    fontStyle: 'italic',
  },
  saveButton: {
    height: 48,
    backgroundColor: Colors.light.buttonBackground,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.light.disabledButton,
  },
  saveButtonText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
});
