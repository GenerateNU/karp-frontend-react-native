import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Event } from '@/types/api/event';
import { Organization } from '@/types/api/organization';

interface FeedCardProps {
  feedItem: Event | Organization;
  onPressEvent?: (feedItem: Event) => void;
  onPressOrg?: (feedItem: Organization) => void;
  formattedStart?: string;
  formattedEnd?: string;
  formattedDay?: string;
  formattedMonth?: string;
  numCoinIcons?: number;
  imgUrl: string | null;
}

// Type guard function
function isEvent(item: Event | Organization): item is Event {
  return 'startDateTime' in item || 'coins' in item;
}

export function FeedCard({
  feedItem,
  onPressEvent,
  onPressOrg,
  formattedStart,
  formattedEnd,
  formattedDay,
  formattedMonth,
  numCoinIcons,
  imgUrl,
}: FeedCardProps) {
  const isEventFeed = isEvent(feedItem);
  const numCoins = isEventFeed ? feedItem.coins : 0;

  return (
    <Pressable
      className="mx-4 my-2.5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
      onPress={
        isEventFeed
          ? () => onPressEvent?.(feedItem)
          : () => onPressOrg?.(feedItem)
      }
      android_ripple={{ color: '#f0f0f0' }}
    >
      {isEventFeed && (
        <View className="absolute right-4 top-4 z-10 flex-row items-center gap-1">
          {Array.from({ length: numCoinIcons ? numCoinIcons : 1 }).map(
            (_, idx) => (
              <Image
                key={idx}
                source={require('../assets/images/karp-coin.png')}
                className="ml-1 h-5 w-5"
              />
            )
          )}
          <Text
            className="text-xs font-normal text-indigo-950"
            style={{ fontFamily: 'Inter' }}
          >
            {numCoins} Koins
          </Text>
        </View>
      )}

      <View className="mt-6 inline-flex h-24 w-full items-start justify-start gap-5">
        <View className="relative h-24 flex-1">
          <View className="absolute left-0 top-0 h-28 w-24 overflow-hidden rounded-[9.86px]">
            {imgUrl ? (
              <Image
                source={{ uri: imgUrl }}
                className="h-full w-full"
                style={{ opacity: 1.0 }}
                resizeMode="cover"
              />
            ) : (
              <View className="h-full w-full bg-indigo-950" />
            )}

            <View className="absolute inset-0 flex items-center justify-center bg-indigo-950/20 px-5 py-3.5">
              <Text className="text-center">
                <Text
                  className="text-base font-bold text-white"
                  style={{ fontFamily: 'Ubuntu' }}
                >
                  {formattedMonth || ''}
                  {'\n'}
                </Text>
                <Text
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: 'Ubuntu' }}
                >
                  {formattedDay || ''}
                </Text>
              </Text>
            </View>
          </View>

          <View
            className="absolute top-0 inline-flex w-52 flex-col items-start justify-center gap-2.5"
            style={{ left: 90 }}
          >
            <Text
              className="w-44 text-base font-bold text-indigo-950"
              style={{ fontFamily: 'Ubuntu' }}
              numberOfLines={2}
            >
              {feedItem.name}
            </Text>

            {feedItem.address && (
              <View className="inline-flex flex-row items-center justify-start gap-2">
                <Image
                  source={require('../assets/images/location-icon.png')}
                  style={{ width: 10, height: 14 }}
                  className="ml-1 h-5 w-5"
                />
                <Text
                  className="flex-1 text-sm font-normal text-indigo-950"
                  style={{ fontFamily: 'Inter' }}
                  numberOfLines={1}
                >
                  {feedItem.address}
                </Text>
              </View>
            )}

            {isEventFeed ? (
              <>
                <View className="inline-flex flex-row items-center justify-start gap-2">
                  <Image
                    source={require('../assets/images/clock-icon.png')}
                    style={{ width: 14, height: 14 }}
                    className="ml-1 h-5 w-5"
                  />
                  <Text
                    className="text-sm font-normal text-indigo-950"
                    style={{ fontFamily: 'Inter' }}
                  >
                    {formattedStart || ''} to {formattedEnd || ''}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Text
                  className="w-44 text-sm font-normal text-indigo-950"
                  style={{ fontFamily: 'Inter' }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {feedItem.description}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      <View className="flex items-end justify-end">
        <Pressable
          className="mt-4 w-24 flex-row items-center justify-center gap-1 rounded-[9.86px] bg-amber-400 px-3 py-2"
          onPress={
            isEventFeed
              ? () => onPressEvent?.(feedItem)
              : () => onPressOrg?.(feedItem)
          }
        >
          <Text
            className="text-xs font-normal text-indigo-950"
            style={{ fontFamily: 'Avenir' }}
          >
            More Info &gt;
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
