import axios from 'axios';
import { getAccessToken } from '../auth/accessTokenStore';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error('VITE_API_BASE_URL must be configured before using the API.');
}

export const apiClient = axios.create({ baseURL });

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return config;
});
