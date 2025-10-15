// export interface Event {
//   id: string;
//   name: string;
//   value: number;
//   spotsRemaining: number;
//   startTime: string;
//   endTime: string;
// }

// export type EventInfo = Event & {
//   organization: string;
//   address: string;
//   description: string;
//   timeSlots: [string];
// };

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
  start_date_time: string;
  end_date_time: string;
  organization_id: string;
  organization?: string;
  status: EventStatus;
  max_volunteers: number;
  spots_remaining?: number;
  description?: string;
  coins: number;
  created_at: string;
  created_by: string;
  timeSlots?: string[];
}

export interface EventFilters {
  category?: string;
  date?: string;
  location?: string;
  isFree?: boolean;
}

export interface EventResponse {
  _id: string;
  name: string;
  address: string;
  location?: Location | null;
  start_date_time: string;
  end_date_time: string;
  organization_id: string;
  status: EventStatus;
  max_volunteers: number;
  coins: number;
  description?: string;
  keywords?: string[];
  age_min?: number;
  age_max?: number;
  created_at: string;
  created_by: string;
}
