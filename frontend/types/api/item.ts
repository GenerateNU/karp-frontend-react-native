export enum ItemStatus {
  APPROVED = 'APPROVED',
  IN_REVIEW = 'IN_REVIEW',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
  ACTIVE = 'ACTIVE',
  CLAIMED = 'CLAIMED',
}

export interface Item {
  id: string;
  name: string;
  status: ItemStatus;
  vendor_name: string;
  time_posted: string;
  expiration: string;
  price: number;
  description: string;
  imageUrl?: string;
}

export interface ItemResponse {
  id: string;
  name: string;
  status: ItemStatus;
  vendor_id: string;
  time_posted: string;
  expiration: string;
  price: number;
}
