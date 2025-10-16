import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Organization } from '@/types/api/organization';

interface OrgCardProps {
  organization: Organization;
  //   onPress: (organization: Organization) => void;
}

export function OrgCard({ organization }: OrgCardProps) {
  // onPress
  //   const formatDateTime = (dateTimeString: string) => {
  //     const date = new Date(dateTimeString);
  //     return date.toLocaleDateString('en-US', {
  //       weekday: 'short',
  //       month: 'short',
  //       day: 'numeric',
  //       hour: 'numeric',
  //       minute: '2-digit',
  //     });

  return (
    <Pressable
      className="mx-4 my-2 overflow-hidden rounded-xl bg-white shadow-sm"
      //   onPress={() => onPress(organization)}
      android_ripple={{ color: '#f0f0f0' }}
    >
      <View className="h-40 bg-gray-100">
        <Image
          source={{
            uri: 'https://www.pointsoflight.org/wp-content/uploads/2021/03/AdobeStock_289737123-scaled.jpeg',
          }}
          className="h-full w-full"
        />
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
