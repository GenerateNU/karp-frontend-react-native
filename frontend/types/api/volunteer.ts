export enum GradeLevel {
  SIXTH_GRADE = '6th Grade',
  SEVENTH_GRADE = '7th Grade',
  EIGHTH_GRADE = '8th Grade',
  NINTH_GRADE = '9th Grade',
  TENTH_GRADE = '10th Grade',
  ELEVENTH_GRADE = '11th Grade',
  TWELFTH_GRADE = '12th Grade',
  UNDERGRADUATE = 'Undergraduate',
  MASTERS = 'Masters',
  PHD = 'PhD',
}

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
  age: number;
  coins: number;
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
  age: number;
  coins: number;
  grade_level: GradeLevel;
  preferences: EventType[];
  qualifications?: Qualification[];
  preferred_days?: DayOfWeek[];
  location: Location;
}

export interface Location {
  type: string;
  coordinates: number[];
}
