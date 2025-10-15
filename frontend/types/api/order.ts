export enum OrderStatus {
  PENDING_PICKUP = 'pending pickup',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Order {
  id: string;
  item_id: string;
  volunteer_id: string;
  placed_at: string;
  order_status: OrderStatus;
}
