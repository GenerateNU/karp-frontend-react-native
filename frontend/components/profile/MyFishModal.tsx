import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface MyFishModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FishItem {
  id: string;
  name: string;
  level: number;
  image: any;
}

// temporary hardcoded fish
const FISH_LIST: FishItem[] = [
  {
    id: '1',
    name: 'Betta fish',
    level: 1,
    image: require('@/assets/images/betta-fish.png'),
  },
  {
    id: '2',
    name: 'Sea bass',
    level: 3,
    image: require('@/assets/images/sea-bass.png'),
  },
  {
    id: '3',
    name: 'Ocean sunfish',
    level: 8,
    image: require('@/assets/images/ocean-sunfish.png'),
  },
  {
    id: '4',
    name: 'Tilapia',
    level: 22,
    image: require('@/assets/images/tilapia.png'),
  },
];

export function MyFishModal({ visible, onClose }: MyFishModalProps) {
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
          <Text style={styles.title}>My Fish</Text>

          <ScrollView
            style={styles.fishList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.fishListContent}
          >
            {FISH_LIST.map(fish => (
              <View key={fish.id} style={styles.fishItem}>
                <Image
                  source={fish.image}
                  style={styles.fishImage}
                  contentFit="contain"
                />
                <View style={styles.fishInfo}>
                  <Text style={styles.levelText}>Level {fish.level}</Text>
                  <Text style={styles.fishName}>{fish.name}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: 360,
    maxHeight: '80%',
    backgroundColor: Colors.light.eggshellWhite,
    borderRadius: 16,
    padding: 24,
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
  levelText: {
    fontFamily: Fonts.light_300,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 6,
  },
  fishName: {
    fontFamily: Fonts.regular_400,
    fontSize: 20,
    fontWeight: '500',
    color: Colors.light.text,
  },
});