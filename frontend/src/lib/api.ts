import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore'; // Import the store

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
  // We read directly from localStorage to be safe, or you could use the store
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Handle Expiration (401)
api.interceptors.response.use(
  (response) => response, // Return successful responses as is
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // This creates a circular dependency warning sometimes, but it's standard for simple apps.
      // We access the store directly to logout.
      useAuthStore.getState().logout();
      
      // Optional: Force reload if the state change doesn't trigger router fast enough
      // window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);