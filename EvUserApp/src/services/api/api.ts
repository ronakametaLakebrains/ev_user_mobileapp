import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentApiConfig } from './config';

const API_BASE_URL = getCurrentApiConfig().baseURL;
const AUTH_TOKEN_KEY = 'auth_token';

let authToken: string | undefined;

export async function setAuthToken(token?: string) {
  authToken = token;
  if (token) {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export async function getAuthToken(): Promise<string | undefined> {
  if (authToken) {
    return authToken;
  }
  try {
    const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      authToken = storedToken;
      return storedToken;
    }
  } catch (error) {
    console.error('Error retrieving auth token:', error);
  }
  return undefined;
}

// Initialize token on app start
export async function initializeAuthToken() {
  try {
    const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      authToken = storedToken;
    }
  } catch (error) {
    console.error('Error initializing auth token:', error);
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers.Accept = 'application/json';
    config.headers['Content-Type'] = 'application/json';

    // Get token from memory or storage
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Centralized error normalization/logging
    return Promise.reject(error);
  },
);

export async function get<T = any>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await apiClient.get<T>(url, config);
  return res.data as unknown as T;
}

export async function post<T = any, B = any>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await apiClient.post<T>(url, body, config);
  return res.data as unknown as T;
}

export async function put<T = any, B = any>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await apiClient.put<T>(url, body, config);
  return res.data as unknown as T;
}

export async function del<T = any>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await apiClient.delete<T>(url, config);
  return res.data as unknown as T;
}

export type ApiError = AxiosError & { status?: number };
