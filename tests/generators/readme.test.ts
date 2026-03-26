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

  it('documents package-manager scripts for bun projects', () => {
    const readme = generateReadme({ ...base, runtime: 'bun', bundler: 'none', packageManager: 'npm' });
    expect(readme).toContain('`npm run dev`');
    expect(readme).toContain('`npm run start`');
    expect(readme).toContain('`npm run build`');
    expect(readme).toContain('`npm run test`');
    expect(readme).not.toContain('`bun run dev`');
  });

  it('documents Tailwind CSS build script when enabled', () => {
    const readme = generateReadme({ ...base, tailwind: true });
    expect(readme).toContain('`npm run build:css`');
  });
});
