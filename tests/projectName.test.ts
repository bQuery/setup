import { describe, expect, it } from 'vitest';
import { getProjectNameValidationError } from '../src/projectName.js';

describe('getProjectNameValidationError', () => {
  it('accepts a simple folder name', () => {
    expect(getProjectNameValidationError('my-app')).toBeUndefined();
  });

  it('rejects nested paths', () => {
    expect(getProjectNameValidationError('foo/bar')).toContain('single folder name');
  });

  it('rejects parent directory segments', () => {
    expect(getProjectNameValidationError('..')).toContain('".."');
  });
});
