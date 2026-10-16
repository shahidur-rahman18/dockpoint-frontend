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
        // রিফ্রেশ কল করার সময় কোনো ডাটা না থাকলে ফাকা অবজেক্ট পাঠাতে হবে
        await axios.post(refreshUrl, {}, { withCredentials: true });

        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);