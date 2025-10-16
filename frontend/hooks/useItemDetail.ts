import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getItem } from '@/services/itemService';
import { createOrder, getVolunteerOrders } from '@/services/orderService';
import { getVolunteer } from '@/services/volunteerService';
import { Item } from '@/types/api/item';
import { Order } from '@/types/api/order';

export function useItemDetail(itemId: string) {
  const { user, token } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [userCoins, setUserCoins] = useState(0);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!token || !user?.entityId) {
        setLoading(false);
        return;
      }

      try {
        const [itemData, volunteerData, orders] = await Promise.all([
          getItem(itemId),
          getVolunteer(user.entityId),
          getVolunteerOrders(user.entityId),
        ]);

        setItem(itemData);
        setUserCoins(volunteerData.coins);

        const alreadyOrdered = orders.some(
          (order: Order) =>
            order.item_id === itemId && order.order_status !== 'cancelled'
        );
        setHasOrdered(alreadyOrdered);
      } catch (error) {
        Alert.alert('Error', `Failed to load item details: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [itemId, token, user]);

  const placeOrder = async () => {
    if (!item || !token) return;

    if (userCoins < item.price) {
      Alert.alert(
        'Insufficient Funds',
        'Not enough coins? Sign up for more events'
      );
      return;
    }

    setOrderLoading(true);

    try {
      await createOrder(itemId);
      setHasOrdered(true);
      setUserCoins(userCoins - item.price);
      Alert.alert('Success!', 'Your order has been placed');
    } catch (error) {
      Alert.alert('Error', `Failed to place an order: ${error}`);
    } finally {
      setOrderLoading(false);
    }
  };

  return {
    item,
    userCoins,
    hasOrdered,
    loading,
    orderLoading,
    placeOrder,
  };
}
