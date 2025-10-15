import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useItemDetail } from '@/hooks/useItemDetail';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Ionicons } from '@expo/vector-icons';

export default function ItemDetailScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();

  const { item, userCoins, hasOrdered, loading, orderLoading, placeOrder } =
    useItemDetail(itemId);

  const hasEnoughCoins = userCoins >= (item?.price ?? 0);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.light.orderButton} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imagePlaceholder} />

        <Text style={styles.title}>{item.name}</Text>

        <Text style={styles.subtitle}>Crumbl</Text>

        <Text style={styles.description}>
          Enjoy a Crumb! Cookie on us! Thanks for helping out in your community!
        </Text>

        {hasOrdered ? (
          <>
            <View style={styles.redeemedButton}>
              <Text style={styles.redeemedButtonText}>Redeemed</Text>
            </View>

            <Text style={styles.howToUseTitle}>How to Use</Text>

            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionText}>
                1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas ac eros erat tincidunt pulvinar sed ac sem.
              </Text>
              <Text style={styles.instructionText}>
                2. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas ac eros erat tincidunt pulvinar sed ac sem.
              </Text>
              <Text style={styles.instructionText}>
                3. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas ac eros erat tincidunt pulvinar sed ac sem.
              </Text>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.orderButton,
                !hasEnoughCoins && styles.orderButtonDisabled,
              ]}
              onPress={placeOrder}
              disabled={!hasEnoughCoins || orderLoading}
            >
              {orderLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.orderButtonText}>{item.price} coins</Text>
              )}
            </TouchableOpacity>

            {!hasEnoughCoins && (
              <View style={styles.insufficientContainer}>
                <Text style={styles.insufficientTitle}>Insufficient Funds</Text>
                <Text style={styles.insufficientText}>
                  Not enough coins?{' '}
                  <Text style={styles.insufficientLink}>
                    Sign up for more events
                  </Text>
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navIcon}>
          <Ionicons name="notifications-outline" size={40} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navIcon}>
          <Ionicons name="fish-outline" size={40} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navIcon}>
          <Ionicons name="person-outline" size={40} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.orderBackground,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingLeft: 12,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: Colors.light.text,
    fontWeight: '300',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 300,
    gap: 16,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 370 / 206,
    backgroundColor: Colors.light.formInputBackground,
    borderRadius: 10,
  },
  title: {
    fontFamily: Fonts.regular_400,
    fontSize: 44,
    lineHeight: 44,
    color: Colors.light.text,
  },
  subtitle: {
    fontFamily: Fonts.light_300,
    fontSize: 32,
    lineHeight: 32,
    color: Colors.light.text,
  },
  description: {
    fontFamily: Fonts.light_300,
    fontSize: 16,
    color: Colors.light.text,
  },
  orderButton: {
    alignSelf: 'center',
    paddingHorizontal: 35,
    paddingVertical: 18,
    backgroundColor: Colors.light.orderButton,
    gap: 10,
    borderRadius: 16,
    marginTop: 29,
  },
  orderButtonDisabled: {
    backgroundColor: Colors.light.disabledButton,
  },
  orderButtonText: {
    fontFamily: Fonts.regular_400,
    fontSize: 22,
    color: Colors.light.text,
  },
  redeemedButton: {
    alignSelf: 'center',
    paddingHorizontal: 35,
    paddingVertical: 18,
    backgroundColor: Colors.light.redeemedButton,
    borderRadius: 16,
    gap: 10,
    marginTop: 29,
  },
  redeemedButtonText: {
    color: Colors.light.redeemedButtonText,
    fontSize: 22,
    fontFamily: Fonts.regular_400,
  },
  insufficientContainer: {
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  insufficientTitle: {
    fontFamily: Fonts.light_300,
    fontSize: 16,
    color: Colors.light.insufficientFunds,
    marginBottom: 9,
  },
  insufficientText: {
    fontFamily: Fonts.light_300,
    color: Colors.light.text,
    fontSize: 16,
  },
  insufficientLink: {
    textDecorationLine: 'underline',
    fontFamily: Fonts.regular_400,
  },
  howToUseTitle: {
    fontFamily: Fonts.light_300,
    fontSize: 24,
    marginTop: 20,
    color: Colors.light.text,
  },
  instructionsContainer: {
    gap: 10,
  },
  instructionText: {
    fontFamily: Fonts.light_300,
    fontSize: 16,
    lineHeight: 20,
    color: Colors.light.text,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 83,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.light.bottomNav,
    borderTopWidth: 1,
    paddingBottom: 20,
    paddingTop: 20,
  },
  navIcon: {
    width: 60,
    height: 60,
    backgroundColor: Colors.light.navIconBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.navIconBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.errorText,
  },
});
