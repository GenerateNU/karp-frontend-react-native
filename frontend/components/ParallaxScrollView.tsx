import type { PropsWithChildren } from 'react';
import { StyleSheet, RefreshControlProps } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { ImageBackground } from 'expo-image';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';

const HEADER_HEIGHT = 200;

const backgroundImages: Record<string, ReturnType<typeof require>> = {
  fishes: require('@/assets/images/fishes-bg.png'),
  bubbles: require('@/assets/images/bubbles-bg.png'),
  waves: require('@/assets/images/waves-bg.png'),
};

type Props = PropsWithChildren<{
  headerImage?: React.ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  backgroundType?: 'fishes' | 'bubbles' | 'waves' | 'default';
  refreshControl?: React.ReactElement<RefreshControlProps>;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  backgroundType = 'default',
  refreshControl,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, 0]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const backgroundImage = backgroundImages[backgroundType];
  const backgroundColor =
    backgroundType === 'default' ? '#FFFFFF' : Colors.light.transparent;

  return (
    <ThemedView lightColor="#FFFFFF" darkColor="#FFFFFF" style={{ flex: 1 }}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        style={{ backgroundColor: backgroundColor }}
        contentContainerStyle={{
          paddingBottom: bottom,
          backgroundColor: backgroundColor,
        }}
        refreshControl={refreshControl}
      >
        {backgroundImage ? (
          <ImageBackground
            source={backgroundImage}
            style={styles.backgroundImage}
            contentFit="cover"
            contentPosition="top center"
          >
            <Animated.View
              style={[
                styles.header,
                {
                  backgroundColor: Colors.light.transparent,
                  paddingTop: 40, // extra space for title
                },
                headerAnimatedStyle,
              ]}
            >
              {headerImage}
            </Animated.View>
            <ThemedView
              style={[
                styles.content,
                { backgroundColor: Colors.light.transparent },
              ]}
            >
              {children}
            </ThemedView>
          </ImageBackground>
        ) : (
          <>
            <Animated.View
              style={[
                styles.header,
                {
                  backgroundColor: '#FFFFFF',
                  paddingTop: 40, // extra space for title
                },
                headerAnimatedStyle,
              ]}
            >
              {headerImage}
            </Animated.View>
            <ThemedView
              style={[
                styles.content,
                { backgroundColor: Colors.light.transparent },
              ]}
            >
              {children}
            </ThemedView>
          </>
        )}
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
  },
  content: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    gap: 16,
  },
  backgroundImage: {
    width: '100%',
    flexGrow: 1,
  },
});
