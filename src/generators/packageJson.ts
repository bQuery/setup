import type { SetupOptions } from '../types.js';
import {
  BQUERY_PACKAGE_NAME,
  BQUERY_UI_PACKAGE_NAME,
  BQUERY_UI_VERSION_SPEC,
  BQUERY_VERSION_SPEC,
} from './bquery.js';

export function generatePackageJson(options: SetupOptions): Record<string, unknown> {
  const { projectName, runtime, bundler, tailwind, packageManager } = options;

  const pkg: Record<string, unknown> = {
    name: projectName,
    version: '0.1.0',
    description: '',
  };

  // ESM type for Vite, explicit ESM runtimes, or Node projects with Tailwind configs
  if (bundler === 'vite' || runtime === 'bun' || runtime === 'deno' || (runtime === 'node' && tailwind)) {
    pkg.type = 'module';
  }

  // Scripts
  const scripts: Record<string, string> = {};

  if (runtime === 'bun') {
    scripts.dev = 'bun run --watch src/index.ts';
    scripts.start = 'bun run src/index.ts';
    scripts.build = 'bun build src/index.ts --outdir dist';
    scripts.test = 'bun test';
  } else if (runtime === 'deno') {
    scripts.dev = 'deno run --watch src/index.ts';
    scripts.start = 'deno run src/index.ts';
    scripts.test = 'deno test';
  } else {
    // Node
    if (bundler === 'vite') {
      scripts.dev = 'vite';
      scripts.build = 'tsc && vite build';
      scripts.preview = 'vite preview';
      scripts.test = 'vitest';
      scripts.lint = 'tsc --noEmit';
    } else {
      // Node without Vite (full or minimal)
      scripts.dev = tailwind ? 'ts-node --esm src/index.ts' : 'ts-node src/index.ts';
      scripts.build = 'tsc';
      scripts.start = 'node dist/index.js';
      scripts.lint = 'tsc --noEmit';
    }
  }

  if (tailwind) {
    scripts['build:css'] = 'tailwindcss -i src/styles.css -o dist/styles.css';
  }

  pkg.scripts = scripts;

  // Dependencies
  const dependencies: Record<string, string> = {
    [BQUERY_PACKAGE_NAME]: BQUERY_VERSION_SPEC,
  };

  if (bundler === 'vite') {
    dependencies[BQUERY_UI_PACKAGE_NAME] = BQUERY_UI_VERSION_SPEC;
  }

  const devDependencies: Record<string, string> = {};

  if (tailwind) {
    devDependencies.tailwindcss = '^3.4.0';
    devDependencies.autoprefixer = '^10.4.0';
    devDependencies.postcss = '^8.4.0';
  }

  if (runtime === 'node') {
    if (bundler === 'vite') {
      devDependencies.vite = '^6.0.0';
      devDependencies.vitest = '^2.1.0';
      devDependencies.typescript = '^5.0.0';
      devDependencies['@types/node'] = '^22.0.0';
    } else {
      devDependencies.typescript = '^5.0.0';
      devDependencies['@types/node'] = '^22.0.0';
      devDependencies['ts-node'] = '^10.9.0';
    }
  } else if (runtime === 'bun') {
    devDependencies['@types/bun'] = 'latest';
  }
  // Deno has built-in TypeScript support, no extra deps needed

  if (Object.keys(dependencies).length > 0) {
    pkg.dependencies = dependencies;
  }
  if (Object.keys(devDependencies).length > 0) {
    pkg.devDependencies = devDependencies;
  }

  if (packageManager === 'pnpm') {
    pkg.packageManager = 'pnpm@latest';
  }

  if (runtime === 'node') {
    pkg.engines = { node: '>=18' };
  }

  return pkg;
}
