import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // When not authenticated, redirect away from tabs to login
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 6,
          marginBottom: 6,
        },
        tabBarStyle: [
          Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
          {
            height: 90,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: Colors.light.bottomNav,
            borderTopWidth: 1,
            borderTopColor: '#000000',
          },
        ],
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="fypTabs"
        options={{
          title: 'Events and Orgs',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 56,
                height: 56,
                backgroundColor: (Colors as any)?.light?.navIconBackground,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: (Colors as any)?.light?.navIconBorder,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: focused ? 1 : 0.6,
              }}
            >
              <Ionicons name="notifications-outline" size={28} color="#000" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 56,
                height: 56,
                backgroundColor: (Colors as any)?.light?.navIconBackground,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: (Colors as any)?.light?.navIconBorder,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: focused ? 1 : 0.6,
              }}
            >
              <Ionicons name="fish-outline" size={28} color="#000" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 56,
                height: 56,
                backgroundColor: (Colors as any)?.light?.navIconBackground,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: (Colors as any)?.light?.navIconBorder,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: focused ? 1 : 0.6,
              }}
            >
              <Ionicons name="person-outline" size={28} color="#000" />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
