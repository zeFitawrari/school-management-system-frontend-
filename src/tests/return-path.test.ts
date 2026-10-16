import { describe, expect, it } from 'vitest';

import { isSafeReturnPath, resolveReturnPath } from '@/lib/route';

describe('isSafeReturnPath', () => {
  it('accepts in-app relative paths', () => {
    expect(isSafeReturnPath('/app/students')).toBe(true);
    expect(isSafeReturnPath('/app/students?page=2#top')).toBe(true);
  });

  it('rejects absolute and protocol-relative URLs', () => {
    expect(isSafeReturnPath('https://evil.example.com')).toBe(false);
    expect(isSafeReturnPath('//evil.example.com')).toBe(false);
    expect(isSafeReturnPath('javascript:alert(1)')).toBe(false);
  });

  it('rejects backslash tricks and non-strings', () => {
    expect(isSafeReturnPath('/\\evil.example.com')).toBe(false);
    expect(isSafeReturnPath('')).toBe(false);
    expect(isSafeReturnPath(null)).toBe(false);
    expect(isSafeReturnPath(undefined)).toBe(false);
    expect(isSafeReturnPath({ pathname: '/app' })).toBe(false);
  });
});

describe('resolveReturnPath', () => {
  it('returns the safe path when valid', () => {
    expect(resolveReturnPath('/app/library')).toBe('/app/library');
  });

  it('falls back when unsafe', () => {
    expect(resolveReturnPath('//evil.example.com', '/app/dashboard')).toBe('/app/dashboard');
    expect(resolveReturnPath(undefined, '/app/dashboard')).toBe('/app/dashboard');
  });
});
