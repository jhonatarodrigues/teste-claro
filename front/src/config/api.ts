import { Platform } from 'react-native';

const API_PORT = 3333;
const API_PATH = '/api';

function normalizeConfiguredUrl(value: string) {
  const trimmed = value.trim().replace(/\/+$/, '');

  if (!trimmed) {
    return '';
  }

  const url = new URL(trimmed);

  if (url.pathname === API_PATH || url.pathname.startsWith(`${API_PATH}/`)) {
    return url.toString().replace(/\/+$/, '');
  }

  url.pathname = `${url.pathname.replace(/\/+$/, '')}${API_PATH}`;
  return url.toString().replace(/\/+$/, '');
}

export function resolveApiBaseUrl(configuredUrl = process.env.EXPO_PUBLIC_API_URL, platform = Platform.OS) {
  if (configuredUrl?.trim()) {
    return normalizeConfiguredUrl(configuredUrl);
  }

  if (platform === 'android') {
    return `http://10.0.2.2:${API_PORT}${API_PATH}`;
  }

  if (platform === 'web') {
    return `http://localhost:${API_PORT}${API_PATH}`;
  }

  return `http://127.0.0.1:${API_PORT}${API_PATH}`;
}

export const apiBaseUrl = resolveApiBaseUrl();
