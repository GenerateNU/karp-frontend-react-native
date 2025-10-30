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
  level: number;
  isActive: boolean;
}
