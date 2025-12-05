import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSignUp } from '@/context/SignUpContext';
import { usePathname, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Image } from 'expo-image';
import { SignUpFlowButton } from '@/components/signup/SignUpFlowButton';
import { EventType } from '@/types/api/volunteer';
import { Ionicons } from '@expo/vector-icons';
import { SignUpProgress } from '@/components/signup/SignUpProgress';

function SignUpPreferences() {
  const pathname = usePathname();
  const isIndexPage = pathname === '/signup';
  const { data, setData, setCurrentStep } = useSignUp();
  const router = useRouter();

  const [selectedPreferences, setSelectedPreferences] = useState<EventType[]>(
    data.preferences || []
  );

  const causes = [
    { type: EventType.ANIMAL_SHELTER, icon: 'paw' },
    { type: EventType.HOMELESS_SHELTER, icon: 'home' },
    { type: EventType.FOOD_PANTRY, icon: 'restaurant' },
    { type: EventType.CLEANUP, icon: 'trash' },
    { type: EventType.TUTORING, icon: 'book' },
  ];

  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const togglePreference = (preference: EventType) => {
    setSelectedPreferences(prev => {
      if (prev.includes(preference)) {
        return prev.filter(p => p !== preference);
      } else {
        return [...prev, preference];
      }
    });
  };

  const handleContinue = () => {
    setData({ preferences: selectedPreferences });
    router.push('/signup/qualifications');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/preferences.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        pointerEvents="none"
      />
      {!isIndexPage && <SignUpProgress />}
      <View style={styles.header}>
        <Text style={styles.title}>
          What cause(s) are most passionate about?
        </Text>
        <Text style={styles.subtitle}>(please select at least three)</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.causesGrid}>
          {causes.map(cause => {
            const isSelected = selectedPreferences.includes(cause.type);
            return (
              <TouchableOpacity
                key={cause.type}
                style={[
                  styles.causeButton,
                  isSelected && styles.selectedCauseButton,
                ]}
                onPress={() => togglePreference(cause.type)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={cause.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={isSelected ? Colors.light.white : Colors.light.text}
                  style={styles.causeIcon}
                />
                <Text
                  style={[
                    styles.causeText,
                    isSelected && styles.selectedCauseText,
                  ]}
                >
                  {cause.type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <SignUpFlowButton
          onPress={handleContinue}
          text="Continue"
          variant="fixed"
          disabled={selectedPreferences.length < 3}
        />
      </View>
    </View>
  );
}

export default function SignUpPreferencesScreen() {
  return <SignUpPreferences />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
    paddingTop: 75,
    paddingBottom: 100,
  },
  header: {
    marginTop: 50,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: Colors.light.text,
    fontFamily: Fonts.bold_700,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Fonts.light_300,
    color: Colors.light.icon,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  causesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  causeButton: {
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
    borderRadius: 8,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginRight: 8,
  },
  selectedCauseButton: {
    backgroundColor: Colors.light.fishBlue,
    borderColor: Colors.light.fishBlue,
  },
  causeIcon: {
    marginRight: 8,
  },
  causeText: {
    fontSize: 12,
    color: Colors.light.text,
    fontFamily: Fonts.medium_500,
    flexShrink: 1,
  },
  selectedCauseText: {
    color: Colors.light.white,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    padding: 20,
  },
});
