export enum OrgStatus {
  APPROVED = 'APPROVED',
  IN_REVIEW = 'IN_REVIEW',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  location: Location | null;
  description?: string;
  status: OrgStatus;
  imageS3Key: string;
}

export interface OrgFilters {
  category?: string;
  date?: string;
  isFree?: boolean;
}

export interface OrgResponse {
  id: string; // camelized from _id
  name: string;
  description: string;
  status: OrgStatus;
}
