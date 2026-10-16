const ACCESS_TOKEN_KEY = 'dockpoint-access-token';
const REFRESH_TOKEN_KEY = 'dockpoint-refresh-token';

export const getAccessToken = (): string | null =>
  sessionStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token: string | null): void => {
  if (token) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const getRefreshToken = (): string | null =>
  sessionStorage.getItem(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token: string | null): void => {
  if (token) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const clearAuthTokens = (): void => {
  setAccessToken(null);
  setRefreshToken(null);
};
