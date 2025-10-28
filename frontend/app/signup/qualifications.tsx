import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSignUp } from '@/context/SignUpContext';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { SignUpFlowButton } from '@/components/signup/SignUpFlowButton';
import { Qualification } from '@/types/api/volunteer';
import { Ionicons } from '@expo/vector-icons';

function SignUpQualifications() {
  const { data, setData, setCurrentStep } = useSignUp();
  const router = useRouter();

  const [selectedQualifications, setSelectedQualifications] = useState<
    Qualification[]
  >(data.qualifications || []);

  const qualifications: {
    type: Qualification;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { type: Qualification.CPR_CERTIFIED, icon: 'medical' },
    { type: Qualification.ELDER_CARE, icon: 'people' },
    { type: Qualification.FOOD_DELIVERY, icon: 'restaurant' },
    { type: Qualification.MULTILINGUAL, icon: 'language' },
    { type: Qualification.TUTORING, icon: 'book' },
    { type: Qualification.RESEARCH, icon: 'search' },
    { type: Qualification.WRITING, icon: 'pencil' },
  ];

  useEffect(() => {
    setCurrentStep(5);
  }, [setCurrentStep]);

  const toggleQualification = (qualification: Qualification) => {
    setSelectedQualifications(prev => {
      if (prev.includes(qualification)) {
        return prev.filter(q => q !== qualification);
      } else {
        return [...prev, qualification];
      }
    });
  };

  const handleContinue = () => {
    setData({ qualifications: selectedQualifications });
    router.push('/signup/volunteer-days');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What qualifications do you have?</Text>
        <Text style={styles.subtitle}>(optional - select all that apply)</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.qualificationsGrid}>
          {qualifications.map(qualification => {
            const isSelected = selectedQualifications.includes(
              qualification.type
            );
            return (
              <TouchableOpacity
                key={qualification.type}
                style={[
                  styles.qualificationButton,
                  isSelected && styles.selectedQualificationButton,
                ]}
                onPress={() => toggleQualification(qualification.type)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={qualification.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={isSelected ? Colors.light.white : Colors.light.text}
                  style={styles.qualificationIcon}
                />
                <Text
                  style={[
                    styles.qualificationText,
                    isSelected && styles.selectedQualificationText,
                  ]}
                >
                  {qualification.type}
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
        />
      </View>
    </View>
  );
}

export default function SignUpQualificationsScreen() {
  return <SignUpQualifications />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
    paddingHorizontal: 20,
    paddingTop: 75,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: Fonts.medium_500,
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
  qualificationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  qualificationButton: {
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
  selectedQualificationButton: {
    backgroundColor: Colors.light.fishBlue,
    borderColor: Colors.light.fishBlue,
  },
  qualificationIcon: {
    marginRight: 8,
  },
  qualificationText: {
    fontSize: 12,
    color: Colors.light.text,
    fontFamily: Fonts.medium_500,
    flexShrink: 1,
  },
  selectedQualificationText: {
    color: Colors.light.white,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.light.white,
  },
});
