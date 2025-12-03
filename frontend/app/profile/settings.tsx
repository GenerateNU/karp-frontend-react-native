import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackHeader } from '@/components/common/BackHeader';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useCurrentVolunteer } from '@/hooks/useCurrentVolunteer';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}

function SettingsItem({ icon, title, subtitle, onPress }: SettingsItemProps) {
  return (
    <Pressable style={styles.settingsItem} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={Colors.light.text} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.light.text} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, volunteer, signOut } = useAuth();
  const { data: qVolunteer } = useCurrentVolunteer();
  const v = qVolunteer ?? volunteer;

  const displayName = user && v ? `${v.firstName} ${v.lastName}` : 'John Doe';

  const firstName = v?.firstName || 'John';
  const lastName = v?.lastName || 'Doe';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <BackHeader />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.profileSection}>
            <ProfileAvatar
              firstName={firstName}
              lastName={lastName}
              size={112}
              volunteerId={v?.id}
            />
            <Text style={styles.profileName}>{displayName}</Text>
          </View>

          <View style={styles.menuContainer}>
            <SettingsItem
              icon="person-outline"
              title="Basic Info"
              subtitle="Update your personal information"
              onPress={() => {
                router.push('/profile/settings/basic-info');
              }}
            />

            <SettingsItem
              icon="lock-closed-outline"
              title="Change password"
              subtitle="Update your password"
              onPress={() => {
                router.push('/profile/settings/change-password');
              }}
            />

            <SettingsItem
              icon="trash-outline"
              title="Delete account"
              subtitle="Delete your account"
              onPress={() => {
                router.push('/profile/settings/delete-account');
              }}
            />
          </View>

          <Pressable
            style={styles.signOutButton}
            onPress={async () => {
              try {
                await signOut();
              } finally {
                router.replace('/login');
              }
            }}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#DC2626"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.signOutButtonText}>Sign out</Text>
          </Pressable>
        </ScrollView>
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerSpacer: {
    width: 40,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 40,
  },
  profileName: {
    fontFamily: Fonts.regular_400,
    fontSize: 20,
    fontWeight: '500',
    color: Colors.light.text,
    marginTop: 20,
  },
  menuContainer: {
    gap: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 84,
    backgroundColor: Colors.light.eggshellWhite,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 26,
    alignSelf: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 6,
  },
  itemSubtitle: {
    fontFamily: Fonts.light_300,
    fontSize: 10,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    marginTop: 24,
    backgroundColor: Colors.light.eggshellWhite,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    borderRadius: 8,
    alignSelf: 'center',
  },
  signOutButtonText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: '500',
    color: '#DC2626',
  },
});
