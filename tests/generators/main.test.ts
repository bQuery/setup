import { describe, it, expect } from 'vitest';
import { generateMainFile, getMainFileName } from '../../src/generators/main.js';
import type { SetupOptions } from '../../src/types.js';

const base: SetupOptions = {
  projectName: 'test-app',
  template: 'full',
  runtime: 'node',
  packageManager: 'npm',
  bundler: 'vite',
  tailwind: false,
  git: false,
  install: false,
};

describe('getMainFileName', () => {
  it('returns main.ts for vite bundler', () => {
    expect(getMainFileName(base)).toBe('main.ts');
  });

  it('returns index.ts for no bundler', () => {
    expect(getMainFileName({ ...base, bundler: 'none' })).toBe('index.ts');
  });

  it('returns index.ts for bun runtime', () => {
    expect(getMainFileName({ ...base, runtime: 'bun', bundler: 'none' })).toBe('index.ts');
  });

  it('returns index.ts for deno runtime', () => {
    expect(getMainFileName({ ...base, runtime: 'deno', bundler: 'none' })).toBe('index.ts');
  });
});

describe('generateMainFile', () => {
  it('vite project uses document.querySelector', () => {
    const content = generateMainFile(base);
    expect(content).toContain('document.querySelector');
    expect(content).toContain('#app');
  });

  it('node project outputs console.log', () => {
    const content = generateMainFile({ ...base, bundler: 'none' });
    expect(content).toContain('console.log');
    expect(content).not.toContain('document');
  });

  it('bun project outputs console.log with Bun mention', () => {
    const content = generateMainFile({ ...base, runtime: 'bun', bundler: 'none' });
    expect(content).toContain('console.log');
    expect(content).toContain('Bun');
  });

  it('deno project outputs console.log with Deno mention', () => {
    const content = generateMainFile({ ...base, runtime: 'deno', bundler: 'none' });
    expect(content).toContain('console.log');
    expect(content).toContain('Deno');
  });
});
