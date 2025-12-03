import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/services/profileService';
import { Event } from '@/types/api/event';

export function useUpcomingEvents(volunteerId?: string) {
  return useQuery<Event[]>({
    queryKey: ['registration', 'events', volunteerId, 'upcoming'],
    queryFn: () => profileService.getUpcomingEvents(volunteerId as string),
    enabled: !!volunteerId,
    staleTime: 1000 * 30,
  });
}
