import React from 'react';
import { View, Pressable, Text } from 'react-native';

interface SubTabBarProps {
  activeTab: 'events' | 'orgs';
  onChange: (tab: 'events' | 'orgs') => void;
}

export default function SubTabBar({ activeTab, onChange }: SubTabBarProps) {
  return (
    <View className="inline-flex flex-row items-center justify-center self-stretch">
      <Pressable
        className="relative h-14 w-1/2"
        onPress={() => onChange('events')}
      >
        <View
          className={`absolute left-0 top-0 h-14 w-full items-center justify-center rounded-tl-[10px] rounded-tr-[10px] border-b border-indigo-950 ${activeTab === 'events' ? 'bg-sky-300' : 'bg-white'}`}
        >
          <Text className="text-base font-bold text-indigo-950">Events</Text>
        </View>
      </Pressable>
      <Pressable
        className="relative h-14 w-1/2"
        onPress={() => onChange('orgs')}
      >
        <View
          className={`absolute left-0 top-0 h-14 w-full items-center justify-center rounded-tl-[10px] rounded-tr-[10px] border-b border-indigo-950 ${activeTab === 'orgs' ? 'bg-sky-300' : 'bg-white'}`}
        >
          <Text className="text-base font-bold text-indigo-950">Orgs</Text>
        </View>
      </Pressable>
    </View>
  );
}
