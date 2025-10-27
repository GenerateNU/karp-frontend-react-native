import { Volunteer } from "./volunteer";
import { Event } from "./event";

export interface ProfileStats {
  totalHours: number;
  level: number;
  levelProgress: number;
  experiencePoints: number;
  nextLevelXP: number;
}

export interface ProfileData {
  volunteer: Volunteer;
  upcomingEvents: Event[];
  stats: ProfileStats;
}