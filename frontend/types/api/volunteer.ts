export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  coins: number;
  preferences: string[];
  isActive: boolean;
  experience: number;
  location: Location;
}

export interface Location {
  type: string;
  coordinates: number[];
}
