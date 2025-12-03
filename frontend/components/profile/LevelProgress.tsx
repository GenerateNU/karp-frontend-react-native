import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface LevelProgressProps {
  level: number;
  progress: number; // 0-100
  motivationalText?: string;
}

export function LevelProgress({
  level,
  progress,
  motivationalText = 'Level up by completing more activities!',
}: LevelProgressProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.motivationalText}>{motivationalText}</Text>
      <View style={styles.progressContainer}>
        <Text style={styles.levelText}>Lv.{level}</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>
        <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 88,
    paddingTop: 16,
    paddingBottom: 12,
    paddingLeft: 14,
    paddingRight: 24,
    backgroundColor: Colors.light.eggshellWhite,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    borderRadius: 8,
    alignSelf: 'stretch',
    marginVertical: 12,
  },
  motivationalText: {
    fontFamily: Fonts.light_300,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    textAlign: 'left',
    marginBottom: 12,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  levelText: {
    fontFamily: Fonts.medium_500,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    width: 35,
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: '#EAE8E8',
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#9D9D9D',
    borderRadius: 100,
  },
  percentageText: {
    fontFamily: Fonts.medium_500,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.text,
    width: 35,
    textAlign: 'right',
    lineHeight: 13,
  },
});
