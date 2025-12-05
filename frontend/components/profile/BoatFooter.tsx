import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const FOOTER_HEIGHT = 100;
export { FOOTER_HEIGHT };

export function BoatFooter() {
  return (
    <View style={[styles.container, { bottom: -150 }]}>
      <Image
        source={require('@/assets/images/boat-footer.png')}
        style={styles.image}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: -50,
    height: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    zIndex: 1,
  },
  image: {
    width: 500,
    height: 500,
  },
});
