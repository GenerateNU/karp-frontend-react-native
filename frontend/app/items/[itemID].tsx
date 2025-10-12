import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ItemInfoTable from '@/components/ui/ItemInfoFull';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { ItemInfo, ItemStatus } from '@/types/api/item';

export default function EventSignUpPage() {
  const { itemId } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [item, setItem] = useState<ItemInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    const fetchEventDetails = async () => {
      // MOCK EVENT DATA FOR NOW
      setItem({
        id: itemId as string,
        name: '1 Cookie',
        price: '20 coins',
        status: ItemStatus.ACTIVE,
        timePosted: new Date().toLocaleString() as string,
        expirationTimestamp: new Date().toLocaleString() as string,
        address: '123 Cookie Lane, Sweet Tooth City, CA 90210',
        description:
          'Enjoy a Crumbl Cookie on us! Thanks for helping out in your community!',
        vendor: 'Crumbl',
      });
      setLoading(false);
    };

    fetchEventDetails();
  }, [itemId, isAuthenticated, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>
          Loading event details...
        </ThemedText>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <ThemedView style={styles.content}>
            <ThemedText type="title" style={styles.title}>
              Sign Up
            </ThemedText>
            <ThemedText type="title" style={styles.infoConfirmationTitle}>
              Info Confirmation:
            </ThemedText>
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
  content: {
    paddingLeft: 34,
    paddingRight: 46,
  },
  title: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 44,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 44,
    paddingBottom: 21,
  },
  infoConfirmationTitle: {
    color: Colors.light.text,
    fontFamily: 'JosefinSans_300Light',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 300,
    paddingBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
});
