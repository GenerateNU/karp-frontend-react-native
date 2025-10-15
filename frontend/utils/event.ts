import { Event, EventResponse, EventStatus } from '@/types/api/event';

// converting event data from backend to Event type
export const toEvent = (eventData: EventResponse): Event => ({
  id: eventData._id ?? '',
  name: eventData.name ?? 'Default Event Name',
  address: eventData.address ?? '',
  location: eventData.location ?? null,
  start_date_time: eventData.start_date_time ?? eventData.start_date_time ?? '',
  end_date_time: eventData.end_date_time ?? eventData.end_date_time ?? '',
  organization_id: eventData.organization_id ?? eventData.organization_id ?? '',
  organization: 'Chicos',
  description: eventData.description ?? 'This is a sample event description.',
  spots_remaining: 5,
  status: eventData.status ?? EventStatus.PUBLISHED,
  max_volunteers: eventData.max_volunteers ?? 0,
  coins: eventData.coins ?? 0,
  created_at: eventData.created_at ?? '',
  created_by: eventData.created_by ?? '',
  timeSlots: ['9:00 AM - 11:00 AM', '1:00 PM - 3:00 PM'],
});
