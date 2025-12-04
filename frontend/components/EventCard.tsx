import React, { useEffect, useState } from 'react';
import { Event } from '@/types/api/event';
import { imageService } from '@/services/imageService';
import { FeedCard } from '@/components/FeedCard';

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  const [imagePreSignedUrl, setImagePreSignedUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchImageUrl() {
      try {
        const url = await imageService.getImageUrl('event', event.id);
        setImagePreSignedUrl(url);
      } catch (err) {
        console.error('Failed to fetch image:', err);
      }
    }

    if (event.imageS3Key) {
      console.log('image key!');
      fetchImageUrl();
    }
  }, [event.id, event.imageS3Key]);

  const formatMonth = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', { month: 'short' });
  };

  const formatDay = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.getDate().toString();
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date
      .toLocaleString('en-US', {
        hour: 'numeric',
        hour12: true,
      })
      .toLowerCase();
  };

  const numCoins = event.coins;

  const numCoinIcons = (() => {
    if (numCoins <= 25) return 1;
    if (numCoins <= 100) return 2;
    if (numCoins <= 200) return 3;
    return 4;
  })();

  return (
    <FeedCard
      feedItem={event}
      onPressEvent={onPress}
      formattedStart={formatTime(event.startDateTime)}
      formattedEnd={formatTime(event.endDateTime)}
      formattedDay={formatDay(event.startDateTime)}
      formattedMonth={formatMonth(event.startDateTime)}
      numCoinIcons={numCoinIcons}
      imgUrl={imagePreSignedUrl}
    />
  );
}
