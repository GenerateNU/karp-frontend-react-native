import { DayOfWeek, EventType, Qualification } from '@/types/api/volunteer';
import { Location } from '@/types/api/location';

export type SignUpData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;

  firstName: string;
  lastName: string;
  preferredName?: string;

  birthday: string;

  preferences: EventType[];

  qualifications?: Qualification[];

  preferredDays?: DayOfWeek[];
};

export type SignUpStep = 1 | 2 | 3 | 4 | 5 | 6;

export type SignUpContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  data: Partial<SignUpData>;
  isLoading: boolean;
  errors: Record<string, string>;
  setData: (data: Partial<SignUpData>) => void;
  setError: (field: string, error: string) => void;
  clearErrors: () => void;
  submitSignUp: () => Promise<void>;
  resetSignUp: () => void;
};

export type CreateUserRequest = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'VOLUNTEER';
};

export type CreateVolunteerRequest = {
  firstName: string;
  lastName: string;
  preferredName?: string;
  birthDate: string;
  preferences: EventType[];
  qualifications: Qualification[];
  preferredDays: DayOfWeek[];
  location: Location;
};
