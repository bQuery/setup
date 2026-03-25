import { describe, it, expect } from 'vitest';
import { generateTsConfig } from '../../src/generators/tsconfig.js';
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

describe('generateTsConfig', () => {
  it('Node + Vite produces Vite-optimized config', () => {
    const config = generateTsConfig(base);
    const opts = config.compilerOptions as Record<string, unknown>;
    expect(opts.allowImportingTsExtensions).toBe(true);
    expect(opts.noEmit).toBe(true);
    expect(opts.module).toBe('ESNext');
    expect(opts.lib).toEqual(expect.arrayContaining(['DOM']));
  });

  it('Node without Vite produces NodeNext config', () => {
    const opts: SetupOptions = { ...base, bundler: 'none' };
    const config = generateTsConfig(opts);
    const compilerOpts = config.compilerOptions as Record<string, unknown>;
    expect(compilerOpts.module).toBe('NodeNext');
    expect(compilerOpts.moduleResolution).toBe('NodeNext');
    expect(compilerOpts.outDir).toBe('./dist');
    expect(compilerOpts.rootDir).toBe('./src');
  });

  it('Bun produces bundler moduleResolution config', () => {
    const opts: SetupOptions = { ...base, runtime: 'bun', bundler: 'none' };
    const config = generateTsConfig(opts);
    const compilerOpts = config.compilerOptions as Record<string, unknown>;
    expect(compilerOpts.target).toBe('ESNext');
    expect(compilerOpts.moduleResolution).toBe('bundler');
  });

  it('Deno produces ESNext config with DOM lib', () => {
    const opts: SetupOptions = { ...base, runtime: 'deno', bundler: 'none' };
    const config = generateTsConfig(opts);
    const compilerOpts = config.compilerOptions as Record<string, unknown>;
    expect(compilerOpts.target).toBe('ESNext');
    expect(compilerOpts.lib).toEqual(expect.arrayContaining(['DOM', 'ESNext']));
  });
});
