import { describe, it, expect } from 'vitest';
import { generatePackageJson } from '../../src/generators/packageJson.js';
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

describe('generatePackageJson', () => {
  it('full template + Node + Vite', () => {
    const pkg = generatePackageJson(base);
    expect(pkg.name).toBe('test-app');
    expect(pkg.type).toBe('module');
    const scripts = pkg.scripts as Record<string, string>;
    expect(scripts.dev).toBe('vite');
    expect(scripts.build).toBe('tsc && vite build');
    expect(scripts.preview).toBe('vite preview');
    expect(scripts.test).toBe('vitest');
    expect(scripts.lint).toBe('tsc --noEmit');
    const devDeps = pkg.devDependencies as Record<string, string>;
    expect(devDeps.vite).toBeDefined();
    expect(devDeps.typescript).toBeDefined();
  });

  it('full template + Node + no Vite', () => {
    const opts: SetupOptions = { ...base, bundler: 'none' };
    const pkg = generatePackageJson(opts);
    expect(pkg.type).toBeUndefined();
    const scripts = pkg.scripts as Record<string, string>;
    expect(scripts.dev).toBe('ts-node src/index.ts');
    expect(scripts.build).toBe('tsc');
    expect(scripts.start).toBe('node dist/index.js');
    expect(scripts.lint).toBe('tsc --noEmit');
    const devDeps = pkg.devDependencies as Record<string, string>;
    expect(devDeps['ts-node']).toBeDefined();
    expect(devDeps.typescript).toBeDefined();
  });

  it('full template + Bun', () => {
    const opts: SetupOptions = { ...base, runtime: 'bun', packageManager: 'bun', bundler: 'none' };
    const pkg = generatePackageJson(opts);
    expect(pkg.type).toBe('module');
    const scripts = pkg.scripts as Record<string, string>;
    expect(scripts.dev).toBe('bun run --watch src/index.ts');
    expect(scripts.start).toBe('bun run src/index.ts');
    expect(scripts.build).toBe('bun build src/index.ts --outdir dist');
    expect(scripts.test).toBe('bun test');
    const devDeps = pkg.devDependencies as Record<string, string>;
    expect(devDeps['@types/bun']).toBeDefined();
  });

  it('full template + Deno', () => {
    const opts: SetupOptions = { ...base, runtime: 'deno', bundler: 'none' };
    const pkg = generatePackageJson(opts);
    expect(pkg.type).toBe('module');
    const scripts = pkg.scripts as Record<string, string>;
    expect(scripts.dev).toBe('deno run --watch src/index.ts');
    expect(scripts.start).toBe('deno run src/index.ts');
    expect(scripts.test).toBe('deno test');
    expect(pkg.devDependencies).toBeUndefined();
  });

  it('full template + Tailwind', () => {
    const opts: SetupOptions = { ...base, tailwind: true };
    const pkg = generatePackageJson(opts);
    const scripts = pkg.scripts as Record<string, string>;
    expect(scripts['build:css']).toBe('tailwindcss -i src/styles.css -o dist/styles.css');
    const devDeps = pkg.devDependencies as Record<string, string>;
    expect(devDeps.tailwindcss).toBeDefined();
    expect(devDeps.autoprefixer).toBeDefined();
    expect(devDeps.postcss).toBeDefined();
  });

  it('minimal template + Node', () => {
    const opts: SetupOptions = { ...base, template: 'minimal', bundler: 'none' };
    const pkg = generatePackageJson(opts);
    const scripts = pkg.scripts as Record<string, string>;
    expect(scripts.dev).toBe('ts-node src/index.ts');
    expect(scripts.build).toBe('tsc');
    expect(scripts.start).toBe('node dist/index.js');
  });

  it('pnpm package manager', () => {
    const opts: SetupOptions = { ...base, packageManager: 'pnpm' };
    const pkg = generatePackageJson(opts);
    expect(pkg.packageManager).toBe('pnpm@latest');
  });
});
