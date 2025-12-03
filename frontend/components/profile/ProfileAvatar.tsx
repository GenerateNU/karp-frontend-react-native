import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useVolunteerProfileImage } from '@/hooks/useVolunteerProfileImage';

interface ProfileAvatarProps {
  firstName: string;
  lastName: string;
  size?: number;
  volunteerId?: string;
}

export function ProfileAvatar({ size = 112, volunteerId }: ProfileAvatarProps) {
  const { data: imageUrl } = useVolunteerProfileImage(volunteerId);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: Colors.light.background,
        },
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
