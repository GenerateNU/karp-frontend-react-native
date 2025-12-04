import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Event } from '@/types/api/event';
import { Image } from 'expo-image';
import { imageService } from '@/services/imageService';
import { orgService } from '@/services/organizationService';

interface Props extends Event {
  registeredCount?: number;
  showCancelButton?: boolean;
  onCancelSignUp?: () => void;
  cancelLoading?: boolean;
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
  coins,
  showCancelButton = false,
  onCancelSignUp,
  cancelLoading = false,
}: Props) {
  const [imagePreSignedUrl, setImagePreSignedUrl] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string>(organization ?? '');

  const start = startDateTime ? new Date(startDateTime) : null;
  const end = endDateTime ? new Date(endDateTime) : null;

  const startDate = start
    ? start.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

    const endDate = end
      ? end.toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
      })
    : '';

    const startTime = start
      ? start.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
      })
    : '';

    const endTime = end
      ? end.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit'
      })
    : '';

  const spotsRemaining = maxVolunteers - registeredCount;

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
    <View style={styles.container}>
      {/* Event Image */}
      {imagePreSignedUrl ? (
        <Image
          source={{ uri: imagePreSignedUrl }}
          style={styles.eventImage}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.eventImage, styles.imagePlaceholder]} />
      )}

      {/* Title Row */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{name}</Text>
      </View>

      {/* Coins Badge + Cancel Button Row */}
      <View style={styles.coinsRow}>
        <View style={styles.coinsBadge}>
          <Image
            source={require('@/assets/images/karp-coin.svg')}
            style={styles.coinIcon}
          />
          <Text style={styles.coinsText}>{coins} Koins</Text>
        </View>

        {showCancelButton && (
          <Pressable
            style={styles.cancelButton}
            onPress={onCancelSignUp}
            disabled={cancelLoading}
          >
            <Text style={styles.cancelButtonText}>
              {cancelLoading ? 'Cancelling...' : 'Cancel Sign Up'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Organizer */}
      <View style={styles.infoRow}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={styles.label}>Organizer:</Text>
        <Text style={[styles.value, { marginTop: 0, marginLeft: 8 }]}>{orgName || '[name]'}</Text>
          </View>
          {address ? (
        <Text style={[styles.value, { marginTop: 4 }]}>{address}</Text>
          ) : null}
        </View>
      </View>

      {/* Slots Remaining */}
      <View style={styles.infoRow}>
        <Text style={styles.slotsLabel}>Spots Remaining: {spotsRemaining}/{maxVolunteers}</Text>
      </View>

      {/* Description */}
      <View style={styles.descriptionSection}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.descriptionText}>
          {description ||
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac eros sed eros tincidunt pulvinar sed ac sem.'}
        </Text>
      </View>

      {/* Date */}
      <View style={styles.infoRow}>
        <Text style={styles.value}>Start: {startDate} at {startTime}</Text>
        <Text style={styles.value}>End: {endDate} at {endTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  eventImage: {
    width: '100%',
    height: 175,
    backgroundColor: '#D9D9D9',
  },
  imagePlaceholder: {
    backgroundColor: '#E5E5E5',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
  },
  title: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 60,
    color: '#1D0F48',
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 12,
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coinIcon: {
    width: 24,
    height: 24,
  },
  coinsText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '400',
    color: '#1D0F48',
  },
  infoRow: {
    paddingHorizontal: 24,
    marginTop: 12,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#1D0F48',
  },
  value: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: '#1D0F48',
    marginTop: 2,
  },
  slotsLabel: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: '#1D0F48',
  },
  descriptionSection: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  descriptionText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19,
    color: '#1D0F48',
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF6347',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: '#FF6347',
  },
});
