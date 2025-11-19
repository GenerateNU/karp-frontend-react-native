export enum OrderStatus {
  PENDING_PICKUP = 'pending pickup',
  COMPLETED = 'completed', // same as claimed
  CANCELLED = 'cancelled',
}

export interface Order {
  id: string;
  itemId: string;
  volunteerId: string;
  placedAt: string;
  orderStatus: OrderStatus;
}
