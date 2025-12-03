import React, { useState } from 'react';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ItemDetailLayout } from '@/components/shop/ItemDetailLayout';
import { OrderStatus, Order } from '@/types/api/order';
import { orderService } from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';

export default function OrderDetailScreen() {
  const params = useLocalSearchParams<{
    orderId: string;
    itemId: string;
    itemName: string;
    itemPrice: string;
    itemDescription: string;
    vendorId: string;
    vendorName: string;
    imageUrl: string;
    orderStatus: string;
  }>();
  const { user } = useAuth();
  const [orderStatus, setOrderStatus] = useState<string>(
    Array.isArray(params.orderStatus)
      ? params.orderStatus[0]
      : params.orderStatus
  );

  // Ensure orderId is a string (expo-router can return arrays)
  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId;

  // Refresh order status when screen comes into focus (e.g., after scanning)
  useFocusEffect(
    React.useCallback(() => {
      const refreshOrderStatus = async () => {
        if (!user?.entityId || !orderId) return;
        try {
          const orders = await orderService.getVolunteerOrders(user.entityId);
          const currentOrder = orders.find(
            (order: Order) => order.id === orderId
          );
          if (currentOrder) {
            setOrderStatus(currentOrder.orderStatus);
          }
        } catch (error) {
          console.error('Failed to refresh order status:', error);
        }
      };
      refreshOrderStatus();
    }, [user?.entityId, orderId])
  );

  const isClaimed = orderStatus === OrderStatus.COMPLETED;

  return (
    <ItemDetailLayout
      imageUrl={params.imageUrl || null}
      itemName={params.itemName || 'Item'}
      itemPrice={parseInt(params.itemPrice || '0', 10)}
      vendorName={params.vendorName || 'Store'}
      description={params.itemDescription || ''}
      instructionsText="Go to store and show them this page to redeem item!"
      orderId={orderId}
      buttonConfig={{
        text: isClaimed ? 'CLAIMED' : 'REDEEMED',
        onPress: () => {},
        variant: isClaimed ? 'claimed' : 'redeemed',
      }}
    />
  );
}
