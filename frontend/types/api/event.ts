import { Location } from '@/types/api/location';

export enum EventStatus {
  COMPLETED = 'COMPLETED',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  DELETED = 'DELETED',
  APPROVED = 'APPROVED',
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
export type EventSortOption =
  | 'been_before'
  | 'new_additions'
  | 'coins_low_to_high'
  | 'coins_high_to_low';

export type EventCause =
  | 'Animals'
  | 'Arts & Culture'
  | 'Climate Change'
  | 'Community'
  | 'Disability'
  | 'Disaster Relief'
  | 'Education'
  | 'Food Security'
  | 'Health & Medicine'
  | 'Human Rights'
  | 'Mental Health'
  | 'Poverty'
  | 'Research'
  | 'Seniors & Retirement';

export type EventQualification =
  | 'Club Leader/Member'
  | 'Camp Counselor'
  | 'Event Volunteer/Organizer'
  | 'Environment Project'
  | 'First Aid Certified'
  | 'Food Safety Certified'
  | 'Google/Microsoft Tools'
  | 'Graphic Design'
  | 'Lifeguard Certified'
  | 'STEM or Robotics'
  | 'Student Council';

export type EventAvailabilityDay =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export const EVENT_AVAILABILITY_DAYS: EventAvailabilityDay[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const EVENT_SORT_OPTIONS: EventSortOption[] = [
  'been_before',
  'new_additions',
  'coins_low_to_high',
  'coins_high_to_low',
];

export const EVENT_CAUSES: EventCause[] = [
  'Animals',
  'Arts & Culture',
  'Climate Change',
  'Community',
  'Disability',
  'Disaster Relief',
  'Education',
  'Food Security',
  'Health & Medicine',
  'Human Rights',
  'Mental Health',
  'Poverty',
  'Research',
  'Seniors & Retirement',
];

export const EVENT_QUALIFICATIONS: EventQualification[] = [
  'Club Leader/Member',
  'Camp Counselor',
  'Event Volunteer/Organizer',
  'Environment Project',
  'First Aid Certified',
  'Food Safety Certified',
  'Google/Microsoft Tools',
  'Graphic Design',
  'Lifeguard Certified',
  'STEM or Robotics',
  'Student Council',
];

export interface EventFilters {
  category?: string;
  date?: string;
  isFree?: boolean;
  sort_by?: EventSortOption;
  causes?: EventCause[];
  qualifications?: EventQualification[];
  availabilityDays?: EventAvailabilityDay[];
  availabilityStartTime?: string; // HH:MM format (24-hour)
  availabilityEndTime?: string; // HH:MM format (24-hour)
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
