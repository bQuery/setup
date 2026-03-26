import { describe, expect, it } from 'vitest';
import { generateReadme } from '../../src/generators/readme.js';
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

describe('generateReadme', () => {
  it('documents package-manager scripts for deno projects', () => {
    const readme = generateReadme({ ...base, runtime: 'deno', bundler: 'none', packageManager: 'pnpm' });
    expect(readme).toContain('`pnpm run dev`');
    expect(readme).toContain('`pnpm run start`');
    expect(readme).toContain('`pnpm run test`');
    expect(readme).not.toContain('deno task');
  });
});
