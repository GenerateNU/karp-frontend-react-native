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
};

export enum EventStatus {
  COMPLETED = 'COMPLETED',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  DELETED = 'DELETED',
  UPCOMING = 'UPCOMING',
}
