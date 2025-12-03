import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Event } from '@/types/api/event';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { imageService } from '@/services/imageService';
import { orgService } from '@/services/organizationService';

interface Props extends Event {
  onSelectTime?: (time: string) => void;
  selectedTime?: string;
}

export default function EventInfoTable({
  id,
  name,
  organization,
  organizationId,
  address,
  description,
  startDateTime,
  endDateTime,
  timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM'],
  imageS3Key,
}: Props) {
  const start = startDateTime ? new Date(startDateTime) : null;
  const end = endDateTime ? new Date(endDateTime) : null;
  const [imagePreSignedUrl, setImagePreSignedUrl] = React.useState<
    string | null
  >(null);
  const [orgName, setOrgName] = useState<string>(organization ?? '');

  useEffect(() => {
    async function fetchImageUrl() {
      try {
        const url = await imageService.getImageUrl('event', id);
        setImagePreSignedUrl(url);
      } catch (err) {
        console.error('Failed to fetch image:', err);
      }
    }

    if (imageS3Key) {
      fetchImageUrl();
    }
  }, [id, imageS3Key]);

  useEffect(() => {
    async function loadOrganizer() {
      try {
        if (organization) {
          setOrgName(organization);
          return;
        }
        if (!organizationId) {
          setOrgName('');
          return;
        }
        const org = await orgService.getOrganizationById(organizationId);
        setOrgName(org?.name ?? '');
      } catch {
        setOrgName('');
      }
    }
    loadOrganizer();
  }, [organization, organizationId]);

  const dateFormatted = start
    ? start.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  const formatDuration = (s: Date, e: Date) => {
    const diffMs = Math.max(0, e.getTime() - s.getTime());
    const totalMinutes = Math.round(diffMs / 60000);
    if (totalMinutes < 60) {
      return `${totalMinutes} min${totalMinutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes === 0
      ? `${hours} hr${hours !== 1 ? 's' : ''}`
      : `${hours} hr ${minutes} min`;
  };

  const duration = start && end ? formatDuration(start, end) : '';

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.light.background }}
      edges={['left', 'right', 'bottom']}
    >
      <ScrollView style={styles.scrollContainer}>
        <ThemedView style={styles.container}>
          {imagePreSignedUrl ? (
            <Image
              source={{
                uri: imagePreSignedUrl,
              }}
              style={styles.imagePlaceholder}
              contentFit="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
          <View style={styles.topRow}>
            <View style={styles.infoColumn}>
              <View style={styles.nameRow}>
                <ThemedText style={styles.title}>{name}</ThemedText>
                <Image
                  source={require('../../assets/images/share.png')}
                  style={styles.shareIcon}
                  contentFit="contain"
                />
              </View>

              <View style={styles.detail}>
                <Text style={styles.detailText}>More information: </Text>
                <Text style={[styles.detailText, styles.spacing]}>
                  {description}
                </Text>
                <Text style={styles.detailText}>Address: </Text>
                <Text style={[styles.detailText, styles.spacing]}>
                  {address}
                </Text>
              </View>
              <Text style={styles.organizationText}>Organizer:</Text>
              <Text style={[styles.organizationText, styles.spacing]}>
                {orgName}
              </Text>
              <Text style={styles.dateText}>Date: {dateFormatted}</Text>
              <Text style={[styles.organizationText, styles.spacing]}>
                Duration: {duration}
              </Text>
              <Text style={styles.detailText}>Available Times: </Text>
              <View style={styles.timesTable}>
                {timeSlots.map((slot, idx) => {
                  // const isSelected = selectedTime === slot;
                  return (
                    <Pressable key={`${slot}-${idx}`} style={styles.timeItem}>
                      <ThemedText style={styles.timeText}>{slot}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.light.background,
    width: '100%',
    gap: 12,
    alignItems: 'center',
  },
  shareIcon: {
    width: 50,
    height: 50,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  nameRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'space-between',
  },
  imagePlaceholder: {
    width: '100%',
    height: 240,
    backgroundColor: Colors.light.imagePlaceholder,
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
    lineHeight: 46,
    flexShrink: 1,
    paddingBottom: 22,
    color: '#000000',
  },
  organizationText: {
    color: Colors.light.text,
    fontFamily: Fonts.light_300,
    fontSize: 22,
    marginBottom: 4,
  },
  spacing: {
    marginBottom: 8,
  },
  detail: {
    width: '100%',
  },
  detailText: {
    color: Colors.light.text,
    fontFamily: Fonts.light_300,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  dateText: {
    color: Colors.light.text,
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  timesTable: {
    width: '100%',
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  timeItem: {
    minWidth: 75,
    paddingHorizontal: 20,
    paddingVertical: 1.25,
    backgroundColor: Colors.light.background,
    borderRadius: 13,
    borderWidth: 0.7,
    borderColor: Colors.light.text,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 8,
    marginBottom: 12,
  },
  timeText: {
    color: Colors.light.text,
    fontSize: 15.16,
    fontFamily: 'JosefinSans_300Light',
    fontWeight: '300',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
});
