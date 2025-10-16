import React from 'react';
import { View, Pressable, Text } from 'react-native';

interface SubTabBarProps {
  activeTab: 'events' | 'orgs';
  onChange: (tab: 'events' | 'orgs') => void;
}

export default function SubTabBar({ activeTab, onChange }: SubTabBarProps) {
  return (
    <View className="flex-row justify-around bg-white p-3 shadow">
      <Pressable onPress={() => onChange('events')}>
        <Text
          className={`text-base font-semibold ${
            activeTab === 'events' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          Events
        </Text>
      </Pressable>

      <Pressable onPress={() => onChange('orgs')}>
        <Text
          className={`text-base font-semibold ${
            activeTab === 'orgs' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          Orgs
        </Text>
      </Pressable>
    </View>
  );
}
