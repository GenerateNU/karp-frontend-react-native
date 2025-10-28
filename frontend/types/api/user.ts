export enum UserType {
  VOLUNTEER = 'VOLUNTEER',
  VENDOR = 'VENDOR',
  ORGANIZATION = 'ORGANIZATION',
  ADMIN = 'ADMIN',
}

export type AuthUser = {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userType?: UserType;
  entityId?: string | null;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  user: {
    id: string;
    email?: string;
    username: string;
    firstName?: string;
    lastName?: string;
    userType?: UserType;
    entityId?: string | null;
  };
};

export type CreateUserRequest = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: UserType;
};
