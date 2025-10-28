import api from '@/api';
import { AuthUser, CreateUserRequest, LoginResponse } from '@/types/api/user';

async function login(params: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  const response = await api.post('/user/token', params, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data as LoginResponse;
}

async function createUser(params: CreateUserRequest): Promise<AuthUser> {
  const response = await api.post('/user/', params, {});
  return response.data;
}

export const userService = {
  login,
  createUser,
};
