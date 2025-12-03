import api from '@/api';
import { Event } from '@/types/api/event';
import { Registration, RegistrationStatus } from '@/types/api/registration';

export async function createRegistration(
  eventId: string
): Promise<Registration> {
  const response = await api.post('/registration/new', { event_id: eventId });
  console.log(response.data);
  return response.data;
}

export async function getEventRegistrations(
  eventId: string
): Promise<Registration[]> {
  const response = await api.get(`/registration/event-volunteers/${eventId}`);
  return response.data;
}

export async function getEventsByVolunteer(
  volunteerId: string,
  status?: RegistrationStatus
): Promise<Event[]> {
  const response = await api.get(`/registration/events/${volunteerId}`, {
    params: { registration_status: status },
  });
  return response.data;
}

export async function checkIn(eventId: string, qrToken: string): Promise<void> {
  await api.put(`/registration/${eventId}/check-in`, null, {
    params: { qr_token: qrToken },
  });
}

export async function checkOut(
  eventId: string,
  qrToken: string
): Promise<void> {
  await api.put(`/registration/${eventId}/check-out`, null, {
    params: { qr_token: qrToken },
  });
}

export async function unregister(
  registrationId: string
): Promise<Registration> {
  const response = await api.put(`/registration/unregister/${registrationId}`);
  return response.data;
}
