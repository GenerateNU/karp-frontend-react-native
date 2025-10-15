export interface Event {
  id: string;
  name: string;
  value: number;
  spotsRemaining: number;
  startTime: string;
  endTime: string;
}

export type EventInfo = Event & {
  organization: string;
  address: string;
  description: string;
  timeSlots: [string];
};

export enum EventStatus {
  COMPLETED = 'COMPLETED',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  DELETED = 'DELETED',
  UPCOMING = 'UPCOMING',
};

export interface Event {
  id: string;
  name: string;
  address: string;
  location: Location | null;
  start_date_time: string;
  end_date_time: string;
  organization_id: string;
  status: EventStatus;
  max_volunteers: number;
  coins: number;
  created_at: string;
  created_by: string;
}
