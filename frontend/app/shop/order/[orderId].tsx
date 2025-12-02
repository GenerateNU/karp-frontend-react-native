import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ItemDetailLayout } from '@/components/shop/ItemDetailLayout';
import { OrderStatus } from '@/types/api/order';

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

  // Ensure orderId is a string (expo-router can return arrays)
  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId;

  const orderStatus = Array.isArray(params.orderStatus)
    ? params.orderStatus[0]
    : params.orderStatus;

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
