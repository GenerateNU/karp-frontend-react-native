import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { achievementService } from '@/services/achievementService';
import type { Achievement } from '@/types/api/achievement';

interface AchievementWithImage extends Achievement {
  imageUrl: string | null;
  receivedAt: string;
}

interface MyFishModalProps {
  visible: boolean;
  onClose: () => void;
  volunteerId: string | null;
}

export function MyFishModal({
  visible,
  onClose,
  volunteerId,
}: MyFishModalProps) {
  const [achievements, setAchievements] = useState<AchievementWithImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!volunteerId) {
        setAchievements([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const volunteerAchievements =
          await achievementService.getVolunteerAchievements(volunteerId);

        const achievementsWithDetails = await Promise.all(
          volunteerAchievements.map(async a => ({
            ...a,
            imageUrl: a.imageS3Key
              ? await achievementService.getAchievementImageUrl(a.id)
              : null,
          }))
        );

        setAchievements(achievementsWithDetails);
      } catch (err) {
        console.error('Error fetching volunteer achievements:', err);
        setAchievements([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (visible) {
      fetchAchievements();
    }
  }, [volunteerId, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={e => e.stopPropagation()}
        >
          <Text style={styles.title}>Fish Collection</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.light.primary} />
            </View>
          ) : achievements.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No achievements yet. Keep volunteering to earn achievements!
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.fishList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.fishListContent}
            >
              {achievements.map(achievement => (
                <View key={achievement.id} style={styles.fishItem}>
                  {achievement.imageUrl ? (
                    <Image
                      source={{ uri: achievement.imageUrl }}
                      style={styles.fishImage}
                      contentFit="contain"
                    />
                  ) : (
                    <View style={styles.placeholderImage} />
                  )}
                  <View style={styles.fishInfo}>
                    <Text style={styles.fishName}>{achievement.name}</Text>
                    {achievement.description && (
                      <Text style={styles.description} numberOfLines={2}>
                        {achievement.description}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.light.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxWidth: 420,
    maxHeight: '80%',
    minHeight: 200,
    backgroundColor: Colors.light.eggshellWhite,
    borderRadius: 16,
    padding: 24,
    overflow: 'hidden',
  },
  title: {
    fontFamily: Fonts.regular_400,
    fontSize: 28,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 24,
  },
  fishList: {
    maxHeight: 500,
  },
  fishListContent: {
    gap: 16,
  },
  fishItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.eggshellWhite,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    borderRadius: 8,
    padding: 16,
    gap: 16,
    height: 100,
  },
  fishImage: {
    width: 120,
    height: 68,
  },
  fishInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  fishName: {
    fontFamily: Fonts.regular_400,
    fontSize: 20,
    fontWeight: '500',
    color: Colors.light.text,
  },
  description: {
    fontFamily: Fonts.light_300,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 180,
    padding: 20,
  },
  emptyText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  placeholderImage: {
    width: 120,
    height: 68,
    backgroundColor: Colors.light.cardBorder,
    borderRadius: 4,
  },
});
