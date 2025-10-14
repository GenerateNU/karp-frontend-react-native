import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ItemInfoTable from '@/components/ui/ItemInfoFull';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { ItemInfo, ItemStatus } from '@/types/api/item';
import { getItemById } from '@/services/itemService';

export default function EventSignUpPage() {
  const { itemId } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [item, setItem] = useState<ItemInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // button status: unpressed | redeemed | insufficient
  const [status, setStatus] = useState<
    'unpressed' | 'redeemed' | 'insufficient'
  >('unpressed');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // if (!isAuthenticated) {
    //   router.replace('/login');
    //   return;
    // }
    // const fetchEventDetails = async () => {
    // MOCK EVENT DATA FOR NOW
    //   setItem({
    //     id: itemId as string,
    //     name: '1 Cookie',
    //     price: '20 coins',
    //     status: ItemStatus.ACTIVE,
    //     timePosted: new Date().toLocaleString() as string,
    //     expirationTimestamp: new Date().toLocaleString() as string,
    //     address: '123 Cookie Lane, Sweet Tooth City, CA 90210',
    //     description:
    //       'Enjoy a Crumbl Cookie on us! Thanks for helping out in your community!',
    //     vendor: 'Crumbl',
    //   });
    //   setLoading(false);
    // };
    const fetchItemDetails = async () => {
      try {
        console.log('Item id:', itemId);
        const itemData = await getItemById(itemId as string);
        console.log('Fetched item data:', itemData);
        setItem({
          id: itemData.id,
          name: itemData.name,
          price: `${itemData.price} coins`,
          status: itemData.status,
          timePosted: itemData.timePosted,
          expirationTimestamp: itemData.expirationTimestamp,
          address: '123 Cookie Lane, Sweet Tooth City, CA 90210',
          description:
            'Crumbl Cookie on us! Thanks for helping out in your community!',
          vendor: itemData.vendor || 'Crumbl',
        });
      } catch (error) {
        console.log('Error fetching item:', error);
        // handle error, e.g. set error message
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId, isAuthenticated, router]);

  const handleRedeemPress = () => {
    // mock user's coin balance
    const userCoins = 15;
    const priceNumber = parseInt(item?.price || '0', 10) || 0;

    if (status === 'redeemed') {
      // allow unpress to reset
      setStatus('unpressed');
      setMessage('');
      return;
    }

    if (userCoins >= priceNumber) {
      setStatus('redeemed');
      setMessage('Success! Item redeemed.');
    } else {
      setStatus('insufficient');
      setMessage('Insufficient coins to redeem this item.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.messageText}>
          Loading event details...
        </ThemedText>
      </View>
    );
  }

  // determine button color based on status
  const buttonStyle =
    status === 'redeemed'
      ? styles.buttonRedeemed
      : status === 'insufficient'
        ? styles.buttonInsufficient
        : styles.buttonDefault;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButtonContainer}
            >
              <Image
                source={require('@/assets/images/backArrow.svg')}
                style={styles.backButtonIcon}
                contentFit="contain"
              />
            </Pressable>
          </View>
          <ThemedView style={styles.content}>
            <ItemInfoTable
              id={item?.id || ''}
              name={item?.name || ''}
              vendor={item?.vendor || ''}
              address={item?.address || ''}
              description={item?.description || ''}
              price={item?.price || ''}
              status={item?.status || ItemStatus.DELETED}
              timePosted={item?.timePosted || ''}
              expirationTimestamp={item?.expirationTimestamp || ''}
            />

            <View style={styles.redeemSection}>
              <Pressable
                style={[styles.button, buttonStyle]}
                onPress={handleRedeemPress}
              >
                <ThemedText style={styles.buttonText}>
                  {status === 'redeemed' ? 'Redeemed' : item?.price || 'Redeem'}
                </ThemedText>
              </Pressable>

              {message ? (
                <View style={styles.messageBox}>
                  <ThemedText
                    style={[
                      styles.messageText,
                      status === 'redeemed'
                        ? styles.messageText
                        : styles.errorText,
                    ]}
                  >
                    {message}
                  </ThemedText>
                </View>
              ) : null}
            </View>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 6,
    paddingLeft: 12,
  },
  backButtonContainer: {
    padding: 8,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonIcon: {
    width: 24,
    height: 24,
  },

  content: {
    paddingLeft: 34,
    paddingRight: 46,
    gap: 16,
    backgroundColor: Colors.light.background,
  },

  redeemSection: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: 200,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDefault: {
    backgroundColor: Colors.light.primary,
  },
  buttonRedeemed: {
    backgroundColor: Colors.light.icon,
  },
  buttonInsufficient: {
    backgroundColor: Colors.light.primary,
  },
  buttonText: {
    color: Colors.light.tint,
    fontWeight: '600',
    fontSize: 16,
  },

  messageBox: {
    width: '100%',
    paddingHorizontal: 8,
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.light.errorText,
  },
});
