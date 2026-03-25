export type SetupTemplate = 'full' | 'minimal';
export type Runtime = 'node' | 'bun' | 'deno';
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
export type Bundler = 'vite' | 'none';

export interface SetupOptions {
  projectName: string;
  template: SetupTemplate;
  runtime: Runtime;
  packageManager: PackageManager;
  bundler: Bundler;
  tailwind: boolean;
  git: boolean;
  install: boolean;
}
