export interface Item {
  id: string;
  name: string;
  price: string;
  status: string;
  timePosted: string;
  expirationTimestamp: string;
}

export type ItemInfo = Item & {
  vendor: string;
  address: string;
  description: string;
};

export enum ItemStatus {
  APPROVED = 'APPROVED',
  IN_REVIEW = 'IN_REVIEW',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
  ACTIVE = 'ACTIVE',
  CLAIMED = 'CLAIMED',
}
