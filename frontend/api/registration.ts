import api from '@/api';
import { Registration } from '@/types/api/registration';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

export function useCreateRegistration(): UseMutationResult<
  Registration,
  Error,
  { eventId: string }
> {
  return useMutation({
    mutationFn: async ({ eventId }: { eventId: string }) => {
      return await api.post('/registration/new', { event_id: eventId });
    },
  });
}
