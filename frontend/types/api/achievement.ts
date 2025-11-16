export interface VolunteerAchievement {
  id: string;
  achievementId: string;
  volunteerId: string;
  receivedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  eventType: string;
  threshold: number;
  imageS3Key?: string | null;
  isActive: boolean;
}

export interface VolunteerReceivedAchievementResponse extends Achievement {
  receivedAt: string;
}
