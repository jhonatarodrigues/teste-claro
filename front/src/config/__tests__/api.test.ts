import { resolveApiBaseUrl } from '../api';

describe('resolveApiBaseUrl', () => {
  it('prefers EXPO_PUBLIC_API_URL when provided and preserves the api path', () => {
    expect(resolveApiBaseUrl('https://example.com/api', 'ios')).toBe('https://example.com/api');
  });

  it('appends /api when the configured base url points at the server root', () => {
    expect(resolveApiBaseUrl('https://example.com/', 'web')).toBe('https://example.com/api');
  });

  it('uses an Android-emulator friendly fallback when no env var exists', () => {
    expect(resolveApiBaseUrl(undefined, 'android')).toBe('http://10.0.2.2:3333/api');
  });

  it('uses localhost-based fallbacks for iOS simulator and web', () => {
    expect(resolveApiBaseUrl(undefined, 'ios')).toBe('http://127.0.0.1:3333/api');
    expect(resolveApiBaseUrl(undefined, 'web')).toBe('http://localhost:3333/api');
  });
});
