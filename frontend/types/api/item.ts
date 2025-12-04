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
  vendorId: string;
  timePosted: string;
  expiration: string;
  price: number;
  description: string | null;
  location: string | null;
  tags: string[];
  imageS3Key?: string | null;
  vendor_name?: string; // For backward compatibility
  vendor_id?: string; // For backward compatibility
}

export interface ItemResponse {
  id: string;
  name: string;
  status: ItemStatus;
  vendorId: string;
  timePosted: string;
  expiration: string;
  price: number;
}

export interface ShopItem {
  id: string;
  name: string;
  store: string;
  coins: number;
  imageS3Key?: string;
  vendorId?: string;
}
