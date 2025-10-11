export enum EventStatus {
  PUBLISHED = 'PUBLISHED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DRAFT = 'DRAFT',
  DELETED = 'DELETED',
}

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
