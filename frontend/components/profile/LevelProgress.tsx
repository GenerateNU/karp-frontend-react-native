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
  motivationalText = 'some motivating text idk some motivating text idk',
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
    width: '90%',
    height: 88,
    paddingTop: 26,
    paddingHorizontal: 32,
    paddingBottom: 19,
    backgroundColor: Colors.light.eggshellWhite,
    borderWidth: 1,
    borderColor: Colors.light.text,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 12,
  },
  motivationalText: {
    fontFamily: Fonts.light_300,
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 23,
    lineHeight: 13,
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
