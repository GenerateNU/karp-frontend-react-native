import { useQuery } from '@tanstack/react-query';
import { volunteerService } from '@/services/volunteerService';

export function useCurrentVolunteer() {
  return useQuery({
    queryKey: ['volunteer', 'me'],
    queryFn: () => volunteerService.getSelf(),
    staleTime: 1000 * 60 * 2,
  });
}
