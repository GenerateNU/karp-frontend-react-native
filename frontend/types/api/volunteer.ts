export enum EventType {
  ANIMAL_SHELTER = 'Animal Shelter',
  HOMELESS_SHELTER = 'Homeless Shelter',
  FOOD_PANTRY = 'Food Pantry',
  CLEANUP = 'Cleanup',
  TUTORING = 'Tutoring',
}

export enum Qualification {
  CPR_CERTIFIED = 'CPR Certified',
  ELDER_CARE = 'Elder Care',
  FOOD_DELIVERY = 'Food Delivery/Distribution',
  MULTILINGUAL = 'Multilingual',
  TUTORING = 'Tutoring',
  RESEARCH = 'Research',
  WRITING = 'Writing/Journalism',
}

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  coins: number;
  preferredName?: string;
  birthDate: string;
  preferences: EventType[];
  qualifications: Qualification[];
  preferredDays: DayOfWeek[];
  isActive: boolean;
  experience: number;
  location: Location;
  hours?: number;
}

export interface Location {
  type: string;
  coordinates: number[];
}
