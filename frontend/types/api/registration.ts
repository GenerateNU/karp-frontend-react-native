export enum RegistrationStatus {
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
  INCOMPLETED = 'incompleted',
  UNREGISTERED = 'unregistered',
}

export interface Registration {
  id: string;
  eventId: string;
  volunteerId: string;
  registeredAt: string;
  registrationStatus: RegistrationStatus;
  clockedIn: string | null;
  clockedOut: string | null;
}
