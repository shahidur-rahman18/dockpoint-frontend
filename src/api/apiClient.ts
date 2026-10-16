import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || '/api';
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL;

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (!baseURL) {
    throw new Error('VITE_API_BASE_URL must be configured before using the API.');
  }

  // যদি লোকালস্টোরেজে টোকেন থাকে, তবে হেডারে যুক্ত করা হবে (ক্রস-ডোমেন হাইব্রিড সাপোর্ট)
  const token = localStorage.getItem('dockpoint_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest.url || '';

    // যদি লগইন বা রিফ্রেশ এন্ডপয়েন্টে নিজেই 401 বা 400 আসে, তবে রিফ্রেশ ইন্টারসেপ্টর চালাব না
    if (
      requestUrl.includes('accounts/login/') ||
      requestUrl.includes('accounts/token/refresh/')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshUrl = `${baseURL}/accounts/token/refresh/`;
        const storedRefreshToken = localStorage.getItem('dockpoint_refresh_token');

        // রিফ্রেশ কল: কুকি থাকলে কুকি দিয়ে হবে, সাথে লোকালস্টোরেজের টোকেনও পাঠানো হবে
        const { data } = await axios.post(
          refreshUrl,
          storedRefreshToken ? { refresh: storedRefreshToken } : {},
          { withCredentials: true }
        );

        if (data?.access) {
          localStorage.setItem('dockpoint_access_token', data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('dockpoint_access_token');
        localStorage.removeItem('dockpoint_refresh_token');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);