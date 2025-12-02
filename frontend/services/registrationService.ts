import api from '@/api';
import { Registration } from '@/types/api/registration';

export async function createRegistration(
  eventId: string
): Promise<Registration> {
  const response = await api.post('/registration/new', { event_id: eventId });
  console.log(response.data);
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
