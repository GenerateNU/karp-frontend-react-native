import api from '@/api';
import { VolunteerReceivedAchievementResponse } from '@/types/api/achievement';

async function getAchievementImageUrl(
  achievementId: string
): Promise<string | null> {
  try {
    const response = await api.get(`/achievement/${achievementId}/image`);
    return response.data.url;
  } catch (err) {
    console.error('Failed to fetch achievement image URL:', err);
    return null;
  }
}

async function getVolunteerAchievements(
  volunteerId: string
): Promise<VolunteerReceivedAchievementResponse[]> {
  try {
    const response = await api.get(`/achievement/volunteer/${volunteerId}`);
    return response.data || [];
  } catch (err) {
    console.error('Failed to fetch volunteer achievements:', err);
    return [];
  }
}

export const achievementService = {
  getAchievementImageUrl,
  getVolunteerAchievements,
};
