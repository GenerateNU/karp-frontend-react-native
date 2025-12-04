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
  registeredCount?: number;
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
  maxVolunteers,
  registeredCount = 0,
  imageS3Key,
}: Props) {
  const start = startDateTime ? new Date(startDateTime) : null;
  const end = endDateTime ? new Date(endDateTime) : null;
  const startDate = start
    ? start.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
  const startTime = start
    ? start.toLocaleString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';
  const endDate = end
    ? end.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
  const endTime = end
    ? end.toLocaleString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  const spotsRemaining = maxVolunteers - registeredCount;

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
              <Text style={styles.spotsText}>
                Spots Remaining: {spotsRemaining} / {maxVolunteers}
              </Text>
              <Text style={styles.dateText}>
                Start: {startDate} at {startTime}{' '}
              </Text>
              <Text style={styles.dateText}>
                End: {endDate} at {endTime}{' '}
              </Text>
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
  spotsText: {
    color: Colors.light.text,
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
});
