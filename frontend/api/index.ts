import axios from 'axios';
import { camelizeKeys } from '@/utils/case';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://localhost:8080',
  timeout: 10000,
});

let authToken: string | null = null;
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

api.interceptors.request.use(config => {
  if (authToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  response => {
    if (response && response.data !== undefined) {
      response.data = camelizeKeys(response.data);
    }
    return response;
  },
  error => {
    throw error;
  }
);

export default api;
