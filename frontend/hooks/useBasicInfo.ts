import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { volunteerService } from '@/services/volunteerService';
import { profileService } from '@/services/profileService';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export function useBasicInfo() {
  const router = useRouter();
  const { user, volunteer, fetchUserEntity } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = async () => {
    const payloadFirstName = firstName.trim() || volunteer?.firstName || '';
    const payloadLastName = lastName.trim() || volunteer?.lastName || '';

    if (!payloadFirstName || !payloadLastName) {
      Alert.alert('Validation Error', 'First name and last name are required');
      return;
    }

    if (!user?.entityId) {
      Alert.alert('Error', 'No volunteer profile found');
      return;
    }

    try {
      setLoading(true);

      const payload: { firstName: string; lastName: string; phone?: string } = {
        firstName: payloadFirstName,
        lastName: payloadLastName,
      };

      const phoneValue = phone.trim() || volunteer?.phone || '';
      if (phoneValue) {
        payload.phone = phoneValue;
      }

      // Send update to server. Then refresh the authoritative volunteer from server
      // so local state matches the DB. Avoid attempting to mutate AuthContext directly.
      await volunteerService.updateVolunteer(user.entityId, payload);
      try {
        await fetchUserEntity();
      } catch {}

      // reset local inputs so placeholders reflect the updated volunteer values
      setFirstName('');
      setLastName('');
      setPhone('');

      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          // Ensure we navigate back to the profile screen even if history is missing
          onPress: () => router.push('/profile'),
        },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need camera roll permissions to upload a profile picture'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadProfilePicture = async (uri: string) => {
    try {
      setUploading(true);

      console.log('[useBasicInfo] Starting upload for uri:', uri);
      const file = await fetch(uri);
      const blob = await file.blob();
      console.log(
        '[useBasicInfo] fetched blob; size=',
        blob.size,
        'type=',
        blob.type
      );

      // Determine the correct file extension from the blob type
      let extension = 'jpg';
      if (blob.type === 'image/png') extension = 'png';
      else if (blob.type === 'image/jpeg' || blob.type === 'image/jpg')
        extension = 'jpg';
      else if (blob.type === 'image/webp') extension = 'webp';

      const filename = `profile.${extension}`; // CHANGE THIS LINE

      // Request presigned URL with correct filename and type
      const data = await profileService.getProfileImageUploadUrl(
        filename, // Now uses correct extension
        blob.type || 'image/jpeg'
      );
      console.log('[useBasicInfo] presign response:', data);
      const uploadUrl = data.uploadUrl;

      console.log('[useBasicInfo] uploading to S3...');
      await profileService.uploadImageToS3(
        uploadUrl,
        blob,
        blob.type || undefined
      );
      console.log('[useBasicInfo] upload to S3 complete');

      try {
        await fetchUserEntity();
        console.log('[useBasicInfo] fetchUserEntity completed');
      } catch (err) {
        console.error('[useBasicInfo] fetchUserEntity failed', err);
      }

      Alert.alert('Success', 'Profile picture updated!');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to upload profile picture';
      Alert.alert('Error', message);
    } finally {
      setUploading(false);
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    phone,
    setPhone,
    loading,
    uploading,
    handleSave,
    handleImagePick,
  };
}
