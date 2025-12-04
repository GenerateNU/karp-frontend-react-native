import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Event as EventType } from '@/types/api/event';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { imageService } from '@/services/imageService';

interface ProfileEventCardProps {
  event: EventType;
  onPress: (event: EventType) => void;
  onCheckIn: (event: EventType) => void;
  onCheckOut: (event: EventType) => void;
}

export function ProfileEventCard({
  event,
  onPress,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCheckIn,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCheckOut,
}: ProfileEventCardProps) {
  const [imagePreSignedUrl, setImagePreSignedUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchImageUrl() {
      try {
        if (event.imageS3Key) {
          const url = await imageService.getImageUrl('event', event.id);
          setImagePreSignedUrl(url);
        }
      } catch (err) {
        console.error('Failed to fetch image:', err);
      }
    }
    fetchImageUrl();
  }, [event.id, event.imageS3Key]);

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate().toString(),
    };
  };

  const formatTimeRange = (startDateTime: string, endDateTime: string) => {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const startTime = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    const endTime = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${startTime} to ${endTime}`;
  };

  const dateInfo = event.startDateTime ? formatDate(event.startDateTime) : null;
  const timeRange =
    event.startDateTime && event.endDateTime
      ? formatTimeRange(event.startDateTime, event.endDateTime)
      : '';

  return (
    <Pressable
      onPress={() => onPress(event)}
      style={styles.card}
      android_ripple={{ color: '#f0f0f0' }}
    >
      <View style={styles.contentContainer}>
        {/* Date Block */}
        <View style={styles.dateBlock}>
          {imagePreSignedUrl ? (
            <Image
              source={{ uri: imagePreSignedUrl }}
              style={styles.dateBlockImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.dateBlockPlaceholder} />
          )}
          <View style={styles.dateBlockOverlay} />
          <View style={styles.dateBlockContent}>
            <Text style={styles.dateMonth}>{dateInfo?.month || 'TBD'}</Text>
            <Text style={styles.dateDay}>{dateInfo?.day || '--'}</Text>
          </View>
        </View>

        {/* Event Info */}
        <View style={styles.eventInfo}>
          <Text style={styles.eventName} numberOfLines={2}>
            {event.name}
          </Text>
          {event.description && (
            <Text style={styles.eventDescription} numberOfLines={3}>
              {event.description}
            </Text>
          )}
        </View>
      </View>

      {/* Footer with Location and Time */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="location" size={16} color={Colors.light.text} />
          <Text style={styles.footerText} numberOfLines={1}>
            {event.address}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="time-outline" size={16} color={Colors.light.text} />
          <Text style={styles.footerText}>{timeRange}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    marginVertical: 6,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  dateBlock: {
    width: 67,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#D9D9D9',
  },
  dateBlockImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  dateBlockPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D9D9D9',
  },
  dateBlockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  dateBlockContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateMonth: {
    fontFamily: Fonts.regular_400,
    fontSize: 12,
    color: Colors.light.white,
    marginBottom: 2,
  },
  dateDay: {
    fontFamily: Fonts.regular_400,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.white,
  },
  eventInfo: {
    flex: 1,
    gap: 6,
  },
  eventName: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    lineHeight: 22,
  },
  eventDescription: {
    fontFamily: Fonts.light_300,
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0F2FE', // Light blue background
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.cardBorder,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  footerText: {
    fontFamily: Fonts.regular_400,
    fontSize: 12,
    color: Colors.light.text,
    flex: 1,
  },
});
