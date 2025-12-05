import axios from 'axios';
import { camelizeKeys, decamelizeKeys } from '@/utils/case';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
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
  if (
    config.data &&
    !(typeof FormData !== 'undefined' && config.data instanceof FormData)
  ) {
    try {
      config.data = decamelizeKeys(config.data);
    } catch {}
  }

  if (config.params) {
    try {
      config.params = decamelizeKeys(config.params);
    } catch {}
  }
  return config;
});

api.interceptors.response.use(
  response => {
    if (response && response.data !== undefined) {
      response.data = camelizeKeys(response.data, {
        preserveLeadingUnderscore: false,
      });
    }
    return response;
  },
  error => {
    throw error;
  }
);

export default api;
