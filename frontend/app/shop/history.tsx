import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { itemService } from '@/services/itemService';
import { vendorService } from '@/services/vendorService';
import { Order, OrderStatus } from '@/types/api/order';
import { Item } from '@/types/api/item';
import { LoadingScreen } from '@/components/LoadingScreen';
import { BackHeader } from '@/components/common/BackHeader';
import { PageBackground } from '@/components/common/PageBackground';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { imageService } from '@/services/imageService';

interface OrderWithItem extends Order {
  item?: Item;
  imageUrl?: string | null;
  vendorName?: string | null;
}

type StatusFilter = 'all' | 'pending' | 'claimed';

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItem[]>([]);
  const [allOrders, setAllOrders] = useState<OrderWithItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const loadOrderHistory = useCallback(
    async (isRefresh = false) => {
      if (!user?.entityId) return;

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const orderList = await orderService.getVolunteerOrders(user.entityId);

        const ordersWithItems = await Promise.all(
          orderList.map(async (order: Order) => {
            try {
              const item = await itemService.getItem(order.itemId);
              let imageUrl: string | null = null;
              let vendorName: string | null = null;

              if (item?.imageS3Key) {
                try {
                  imageUrl = await imageService.getImageUrl(
                    'item',
                    order.itemId
                  );
                } catch (error) {
                  console.error(
                    `Failed to load image for item ${order.itemId}:`,
                    error
                  );
                }
              }

              try {
                const vendor = await vendorService.getVendorById(item.vendorId);
                vendorName = vendor?.name || null;
              } catch (error) {
                console.error(
                  `Failed to load vendor for item ${order.itemId}:`,
                  error
                );
              }

              return { ...order, item, imageUrl, vendorName };
            } catch (error) {
              console.error(`Failed to load item ${order.itemId}:`, error);
              return {
                ...order,
                item: undefined,
                imageUrl: null,
                vendorName: null,
              };
            }
          })
        );

        ordersWithItems.sort((a, b) => {
          const dateA = new Date(a.placed_at).getTime();
          const dateB = new Date(b.placed_at).getTime();
          return dateB - dateA;
        });

        setAllOrders(ordersWithItems);
      } catch (error) {
        console.error('Error loading order history:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.entityId]
  );

  const applyStatusFilter = (
    ordersList: OrderWithItem[],
    filter: StatusFilter
  ) => {
    if (filter === 'all') {
      setOrders(ordersList);
    } else if (filter === 'pending') {
      setOrders(
        ordersList.filter(
          order => order.orderStatus === OrderStatus.PENDING_PICKUP
        )
      );
    } else if (filter === 'claimed') {
      setOrders(
        ordersList.filter(order => order.orderStatus === OrderStatus.COMPLETED)
      );
    }
  };

  useEffect(() => {
    loadOrderHistory();
  }, [loadOrderHistory]);

  useEffect(() => {
    applyStatusFilter(allOrders, statusFilter);
  }, [statusFilter, allOrders]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return Colors.light.orderStatusClaimed;
      case OrderStatus.PENDING_PICKUP:
        return Colors.light.orderStatusPending;
      case OrderStatus.CANCELLED:
        return '#F44336';
      default:
        return Colors.light.textSecondary;
    }
  };

  const getOrderStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return 'CLAIMED';
      case OrderStatus.PENDING_PICKUP:
        return 'PENDING';
      case OrderStatus.CANCELLED:
        return 'CANCELLED';
      default:
        return '';
    }
  };

  const renderOrderItem = ({ item: order }: { item: OrderWithItem }) => (
    <View style={styles.orderCard}>
      {order.imageUrl ? (
        <Image
          source={{ uri: order.imageUrl }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.itemImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.orderInfo}>
        <View style={styles.statusContainer}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusCircle,
                { backgroundColor: getStatusColor(order.orderStatus) },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(order.orderStatus) },
              ]}
              numberOfLines={1}
            >
              {getOrderStatusText(order.orderStatus)}
            </Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemName} numberOfLines={2}>
            {order.item?.name || 'Item unavailable'}
          </Text>
          <Text style={styles.itemStore}>
            {order.vendorName || 'Unknown store'}
          </Text>
        </View>
        <Pressable
          style={styles.moreInfoButton}
          onPress={() => {
            router.push({
              pathname: '/shop/order/[orderId]',
              params: {
                orderId: order.id,
                itemId: order.itemId,
                itemName: order.item?.name || '',
                itemPrice: order.item?.price || 0,
                itemDescription: order.item?.description || '',
                vendorId: order.item?.vendorId || '',
                vendorName: order.vendorName || '',
                imageUrl: order.imageUrl || '',
              },
            });
          }}
        >
          <Text style={styles.moreInfoText}>More Info</Text>
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return <LoadingScreen text="Loading order history..." />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PageBackground type="waves" style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <BackHeader />
          <View style={styles.header}>
            <Text style={styles.title}>History</Text>
          </View>
          <View style={styles.filterContainer}>
            <Pressable
              style={[
                styles.filterPill,
                statusFilter === 'all' && [
                  styles.filterPillActive,
                  { backgroundColor: Colors.light.orderStatusAll },
                ],
              ]}
              onPress={() => setStatusFilter('all')}
            >
              <Text
                style={[
                  styles.filterText,
                  statusFilter === 'all' && styles.filterTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterPill,
                statusFilter === 'pending' && [
                  styles.filterPillActive,
                  { backgroundColor: Colors.light.orderStatusPending },
                ],
              ]}
              onPress={() => setStatusFilter('pending')}
            >
              <Text
                style={[
                  styles.filterText,
                  statusFilter === 'pending' && styles.filterTextActive,
                ]}
              >
                Pending
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterPill,
                statusFilter === 'claimed' && [
                  styles.filterPillActive,
                  { backgroundColor: Colors.light.orderStatusClaimed },
                ],
              ]}
              onPress={() => setStatusFilter('claimed')}
            >
              <Text
                style={[
                  styles.filterText,
                  statusFilter === 'claimed' && [
                    styles.filterTextActive,
                    { color: Colors.light.white },
                  ],
                ]}
              >
                Claimed
              </Text>
            </Pressable>
          </View>
          <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={renderOrderItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadOrderHistory(true)}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  No orders yet. Start shopping to see your order history here!
                </Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        </SafeAreaView>
      </PageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 34,
    paddingVertical: 16,
  },
  title: {
    fontFamily: Fonts.regular_400,
    fontSize: 32,
    alignSelf: 'center',
    color: Colors.light.primaryText,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.transparent,
    borderWidth: 1,
    borderColor: Colors.light.textSecondary + '50',
    color: Colors.light.primaryText,
  },
  filterPillActive: {
    borderColor: Colors.light.transparent,
  },
  filterText: {
    fontFamily: Fonts.regular_400,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  filterTextActive: {
    color: Colors.light.primaryText,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.transparent,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.textSecondary + '30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.light.eggshellWhite,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.eggshellWhite,
  },
  placeholderText: {
    fontFamily: Fonts.light_300,
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  statusContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
    maxWidth: '100%',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontFamily: Fonts.regular_400,
    fontSize: 12,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  itemName: {
    fontFamily: Fonts.regular_400,
    fontSize: 18,
    color: Colors.light.primaryText,
    marginBottom: 4,
  },
  itemStore: {
    fontFamily: Fonts.light_300,
    fontSize: 14,
    color: Colors.light.primaryText,
    paddingTop: 5,
  },
  moreInfoButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.moreInfoButton,
    color: Colors.light.primaryText,
    borderWidth: 1,
    borderColor: Colors.light.textSecondary + '50',
  },
  moreInfoText: {
    fontFamily: Fonts.regular_400,
    fontSize: 14,
    color: Colors.light.primaryText,
  },
  emptyState: {
    paddingHorizontal: 32,
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Fonts.light_300,
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
