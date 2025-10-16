import api from '@/api';

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

export async function login(params: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  const response = await api.post('/user/token', params, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data as LoginResponse;
}
