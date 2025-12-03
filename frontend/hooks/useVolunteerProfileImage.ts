import { useQuery } from '@tanstack/react-query';
import { volunteerService } from '@/services/volunteerService';

export function useVolunteerProfileImage(volunteerId?: string) {
  return useQuery({
    queryKey: ['volunteerProfileImage', volunteerId],
    enabled: !!volunteerId,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      if (!volunteerId) return null;
      return await volunteerService.getVolunteerProfilePictureUrl(volunteerId);
    },
  });
}
