import axios from 'axios';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '../auth/accessTokenStore';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || '/api';
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL;

interface AuthTokens {
  access: string;
  refresh: string;
}

export const apiClient = axios.create({ baseURL });

let refreshRequest: Promise<AuthTokens> | null = null;

apiClient.interceptors.request.use((config) => {
  if (!baseURL) {
    throw new Error('VITE_API_BASE_URL must be configured before using the API.');
  }

  const accessToken = getAccessToken();
  if (accessToken && !config.headers.has('Authorization')) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url ?? '';

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      requestUrl.includes('accounts/login/') ||
      requestUrl.includes('accounts/token/refresh/')
    ) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshRequest) {
        refreshRequest = axios
          .post<AuthTokens>(`${baseURL}/accounts/token/refresh/`, { refresh: refreshToken })
          .then(({ data }) => {
            setAccessToken(data.access);
            setRefreshToken(data.refresh);
            return data;
          })
          .finally(() => {
            refreshRequest = null;
          });
      }

      await refreshRequest;
      const accessToken = getAccessToken();
      if (accessToken) {
        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthTokens();
      return Promise.reject(refreshError);
    }
  }
);