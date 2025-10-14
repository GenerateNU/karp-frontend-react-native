import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { EventInfo } from '@/types/api/event';

// TODO: fix formatting and style to match Event View + Details Figma
export default function EventInfoTable({
  name,
  organization,
  address,
  description,
}: EventInfo) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.topRow}>
        <View style={styles.infoColumn}>
          <ThemedText style={styles.title}>{name}</ThemedText>
          <View style={styles.detail}>
            <Text>More information: </Text>
            <Text style={styles.detailText}>{description}</Text>
          </View>
          <Text>Organizer:</Text>
          <Text style={styles.organization}>{organization}</Text>
          <Text style={styles.subtitle}>{address}</Text>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    width: '100%',
    padding: 16,
    gap: 12,
  },

  topRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  imagePlaceholder: {
    width: '100%',
    height: 240,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 44,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 44,
    paddingBottom: 21,
    color: '#000000',
  },
  organization: {
    color: Colors.light.text,
    fontFamily: Fonts.regular_400,
    fontSize: 14,
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.light.text,
    fontFamily: Fonts.light_300,
    fontSize: 14,
    marginBottom: 8,
  },

  detail: {
    width: '100%',
  },
  detailText: {
    color: Colors.light.text,
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    lineHeight: 22,
  },
});
