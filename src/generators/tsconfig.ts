import type { SetupOptions } from '../types.js';

export function generateTsConfig(options: SetupOptions): Record<string, unknown> {
  const { runtime, bundler } = options;

  if (runtime === 'bun') {
    return {
      compilerOptions: {
        target: 'ESNext',
        module: 'ESNext',
        moduleResolution: 'bundler',
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        outDir: './dist',
        rootDir: './src',
      },
      include: ['src'],
      exclude: ['node_modules', 'dist'],
    };
  }

  if (runtime === 'deno') {
    return {
      compilerOptions: {
        target: 'ESNext',
        lib: ['ESNext', 'DOM'],
        module: 'ESNext',
        moduleResolution: 'node',
        strict: true,
        skipLibCheck: true,
      },
      include: ['src'],
      exclude: ['node_modules'],
    };
  }

  // Node
  if (bundler === 'vite') {
    return {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        module: 'ESNext',
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        isolatedModules: true,
        noEmit: true,
        strict: true,
        skipLibCheck: true,
      },
      include: ['src'],
      exclude: ['node_modules', 'dist'],
    };
  }

  // Node without Vite
  return {
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      strict: true,
      outDir: './dist',
      rootDir: './src',
      declaration: true,
      skipLibCheck: true,
      esModuleInterop: true,
    },
    include: ['src'],
    exclude: ['node_modules', 'dist'],
  };
}
