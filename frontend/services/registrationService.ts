import api from '@/api';
import { Registration } from '@/types/api/registration';

export async function createRegistration(
  eventId: string
): Promise<Registration> {
  const response = await api.post('/registration/new', { event_id: eventId });
  return response.data;
}
