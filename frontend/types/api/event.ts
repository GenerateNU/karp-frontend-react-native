import { Location } from '@/types/api/location';

export enum EventStatus {
  COMPLETED = 'COMPLETED',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  DELETED = 'DELETED',
  UPCOMING = 'UPCOMING',
}

export interface Event {
  id: string;
  name: string;
  address: string;
  location: Location | null;
  startDateTime: string;
  endDateTime: string;
  organizationId: string;
  organization?: string;
  status: EventStatus;
  maxVolunteers: number;
  description?: string;
  coins: number;
  createdAt: string;
  createdBy: string;
  timeSlots?: string[];
  imageS3Key: string;
}
export interface EventFilters {
  category?: string;
  date?: string;
  isFree?: boolean;
}

export interface EventResponse {
  id: string; // camelized from _id
  name: string;
  address: string;
  location?: Location | null;
  startDateTime: string; // camelized from start_date_time
  endDateTime: string; // camelized from end_date_time
  organizationId: string; // camelized from organization_id
  status: EventStatus;
  maxVolunteers: number; // camelized from max_volunteers
  coins: number;
  description?: string;
  keywords?: string[];
  ageMin?: number; // camelized from age_min
  ageMax?: number; // camelized from age_max
  createdAt: string; // camelized from created_at
  createdBy: string; // camelized from created_by
}
