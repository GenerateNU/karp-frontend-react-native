export type AuthUser = {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
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
    userType?: string;
    entityId?: string | null;
  };
};
