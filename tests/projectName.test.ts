import { describe, expect, it } from 'vitest';
import { getProjectNameValidationError } from '../src/projectName.js';

describe('getProjectNameValidationError', () => {
  it('accepts a simple folder name', () => {
    expect(getProjectNameValidationError('my-app')).toBeUndefined();
  });

  it('rejects uppercase names', () => {
    expect(getProjectNameValidationError('My-App')).toContain('lowercase');
  });

  it('rejects scoped-like names', () => {
    expect(getProjectNameValidationError('@foo')).toContain('lowercase');
  });

  it('rejects nested paths', () => {
    expect(getProjectNameValidationError('foo/bar')).toContain('single folder name');
  });

  it('rejects parent directory segments', () => {
    expect(getProjectNameValidationError('..')).toContain('".."');
  });

  it('rejects reserved package names', () => {
    expect(getProjectNameValidationError('node_modules')).toContain('reserved');
  });
});
