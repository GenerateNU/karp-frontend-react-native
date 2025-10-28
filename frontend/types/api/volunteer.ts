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
  first_name: string;
  last_name: string;
  coins: number;
  preferred_name?: string;
  birth_date: string;
  preferences: EventType[];
  qualifications: Qualification[];
  preferred_days: DayOfWeek[];
  is_active: boolean;
  experience: number;
  location: Location;
}

export interface CreateVolunteerRequest {
  first_name: string;
  last_name: string;
  coins: number;
  preferred_name?: string;
  birth_date: string;
  preferences: EventType[];
  qualifications?: Qualification[];
  preferred_days?: DayOfWeek[];
  location: Location;
}

export interface Location {
  type: string;
  coordinates: number[];
}
