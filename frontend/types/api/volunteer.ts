export interface Volunteer {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  coins: number;
  preferences: string[];
  is_active: boolean;
  experience: number;
  location: Location;
}

export interface Location {
  type: string;
  coordinates: number[];
}
