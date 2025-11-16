import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { itemService } from '@/services/itemService';
import { orderService } from '@/services/orderService';
import { volunteerService } from '@/services/volunteerService';
import { Item } from '@/types/api/item';
import { Order } from '@/types/api/order';

export function useItemDetail(itemId: string) {
  const { user, token, fetchUserEntity } = useAuth();

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
          itemService.getItem(itemId),
          volunteerService.getVolunteer(user.entityId),
          orderService.getVolunteerOrders(user.entityId),
        ]);

        setItem(itemData);
        if (volunteerData) {
          setUserCoins(volunteerData.coins);
        } else {
          setUserCoins(0);
        }

        const alreadyOrdered = orders.some(
          (order: Order) =>
            order.itemId === itemId && order.orderStatus !== 'cancelled'
        );
        setHasOrdered(alreadyOrdered);
      } catch (error) {
        Alert.alert('Error', `Failed to load item details: ${error}`);
        console.log(error);
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
      await orderService.createOrder(itemId);
      await fetchUserEntity();
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
