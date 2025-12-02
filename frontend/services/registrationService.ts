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
  await api.post(`/registration/${eventId}/check-in`, null, {
    params: { qr_token: qrToken },
  });
}
