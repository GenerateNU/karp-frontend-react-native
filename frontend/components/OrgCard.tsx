import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Organization } from '@/types/api/organization';
import { imageService } from '@/services/imageService';

interface OrgCardProps {
  organization: Organization;
  onPress?: (organization: Organization) => void;
}

export function OrgCard({ organization, onPress }: OrgCardProps) {
  const [imagePreSignedUrl, setImagePreSignedUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchImageUrl() {
      try {
        const url = await imageService.getImageUrl(
          'organization',
          organization.id
        );
        setImagePreSignedUrl(url);
      } catch (err) {
        console.error('Failed to fetch image:', err);
      }
    }

    if (organization.imageS3Key) {
      console.log('organization key!');
      fetchImageUrl();
    }
  }, [organization.id, organization.imageS3Key]);

  return (
    <Pressable
      className="mx-4 my-2 overflow-hidden rounded-xl bg-white shadow-sm"
      onPress={() => onPress?.(organization)}
      android_ripple={{ color: '#f0f0f0' }}
    >
      <View className="h-40 bg-gray-100">
        {imagePreSignedUrl ? (
          <Image
            source={{ uri: imagePreSignedUrl }}
            className="h-full w-full"
          />
        ) : null}
      </View>

      <View className="p-4">
        <Text
          className="mb-1 text-lg font-semibold text-gray-900"
          numberOfLines={2}
        >
          {organization.name}
        </Text>

        <View className="mt-1">
          <Text className="text-xs text-gray-600">
            Description:{' '}
            {organization.description || 'No description available.'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
