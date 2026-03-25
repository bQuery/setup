import * as p from '@clack/prompts';
import type { SetupOptions, SetupTemplate, Runtime, PackageManager, Bundler } from './types.js';

function assertNotCancelled<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }
  return value as T;
}

export async function runPrompts(initialName?: string): Promise<SetupOptions> {
  p.intro('Welcome to bQuery Setup!');

  const projectName = initialName
    ? initialName
    : assertNotCancelled(
        await p.text({
          message: 'What is your project name?',
          placeholder: 'my-bquery-app',
          validate: (v) => (v.length === 0 ? 'Project name is required' : undefined),
        }),
      );

  const template = assertNotCancelled(
    await p.select<SetupTemplate>({
      message: 'Which template would you like to use?',
      options: [
        { value: 'full', label: 'Full', hint: 'complete template with all tools' },
        { value: 'minimal', label: 'Minimal', hint: 'bare bones' },
      ],
    }),
  );

  const runtime = assertNotCancelled(
    await p.select<Runtime>({
      message: 'Which runtime?',
      options: [
        { value: 'node', label: 'Node.js' },
        { value: 'bun', label: 'Bun' },
        { value: 'deno', label: 'Deno' },
      ],
    }),
  );

  const packageManager = assertNotCancelled(
    await p.select<PackageManager>({
      message: 'Which package manager?',
      options: [
        { value: 'npm', label: 'npm' },
        { value: 'pnpm', label: 'pnpm' },
        { value: 'yarn', label: 'yarn' },
        { value: 'bun', label: 'bun' },
      ],
    }),
  );

  const defaultBundler: Bundler = template === 'full' ? 'vite' : 'none';
  const bundler = assertNotCancelled(
    await p.select<Bundler>({
      message: 'Which bundler?',
      options: [
        { value: 'vite', label: 'Vite', hint: 'recommended for full template' },
        { value: 'none', label: 'None' },
      ],
      initialValue: defaultBundler,
    }),
  );

  const tailwind = assertNotCancelled(
    await p.confirm({
      message: 'Add Tailwind CSS?',
      initialValue: false,
    }),
  );

  const git = assertNotCancelled(
    await p.confirm({
      message: 'Initialize a git repository?',
      initialValue: true,
    }),
  );

  const install = assertNotCancelled(
    await p.confirm({
      message: 'Install dependencies?',
      initialValue: true,
    }),
  );

  p.outro('Options collected. Generating project...');

  return {
    projectName: projectName as string,
    template,
    runtime,
    packageManager,
    bundler,
    tailwind,
    git,
    install,
  };
}
