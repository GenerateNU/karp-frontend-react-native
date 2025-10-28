import api from '@/api';
import { LoginResponse } from '@/types/api/user';

async function login(params: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  const response = await api.post('/user/token', params, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data as LoginResponse;
}

async function resetPassword(params: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await api.post('/user/reset-password', params, {
    headers: { 'Content-Type': 'application/json' },
  });
}

export const userService = {
  login,
  resetPassword,
};