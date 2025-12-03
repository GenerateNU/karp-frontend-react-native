import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/HapticTab';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // if (!isAuthenticated && !isGuest) {
  //   return <Redirect href="/login" />;
  // }

  return (
    <Tabs
      // eslint-disable-next-line
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#1D0F48', // indigo-950
        tabBarInactiveTintColor: '#1D0F48', // indigo-950
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '400',
          marginTop: 4,
        },
        tabBarButton: HapticTab,
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 4,
          paddingBottom: 4,
        },
        tabBarStyle: [
          Platform.select({
            ios: {
              position: 'absolute',
              bottom: 0,
            },
            default: {
              position: 'absolute',
              bottom: 0,
            },
          }),
          {
            height: 70 + insets.bottom, // Base height + safe area
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 8),
            backgroundColor: '#7DD3FC', // sky-300
            borderTopWidth: 0.2,
            borderTopColor: '#1D0F48', // indigo-950
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
        ],
      })}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="fypTabs"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/images/home-icon.svg')}
              style={{
                width: 33,
                height: 30,
                opacity: focused ? 1 : 0.6,
              }}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/images/shop-icon.svg')}
              style={{
                width: 28,
                height: 30,
                opacity: focused ? 1 : 0.6,
              }}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rank"
        options={{
          title: 'Rank',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/images/rank-icon.svg')}
              style={{
                width: 28,
                height: 31,
                opacity: focused ? 1 : 0.6,
              }}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/images/profile-icon.svg')}
              style={{
                width: 30,
                height: 30,
                opacity: focused ? 1 : 0.6,
              }}
              contentFit="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
