import { DayOfWeek, EventType, Qualification } from '@/types/api/volunteer';

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
  first_name: string;
  last_name: string;
  user_type: 'VOLUNTEER';
};

export type CreateVolunteerRequest = {
  first_name: string;
  last_name: string;
  age: number;
  coins: number;
  preferences: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
};
