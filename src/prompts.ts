import * as p from '@clack/prompts';
import pc from 'picocolors';
import { getProjectNameValidationError } from './projectName.js';
import type { SetupOptions, SetupTemplate, Runtime, PackageManager, Bundler } from './types.js';

function assertNotCancelled<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }
  return value as T;
}

function getPackageManagerOptions(runtime: Runtime): Array<{ value: PackageManager; label: string; hint?: string }> {
  if (runtime === 'bun') {
    return [
      { value: 'bun', label: 'bun', hint: 'recommended for Bun runtime' },
      { value: 'npm', label: 'npm' },
      { value: 'pnpm', label: 'pnpm' },
      { value: 'yarn', label: 'yarn' },
    ];
  }
  return [
    { value: 'npm', label: 'npm' },
    { value: 'pnpm', label: 'pnpm' },
    { value: 'yarn', label: 'yarn' },
    { value: 'bun', label: 'bun' },
  ];
}

function formatSummary(options: SetupOptions): string {
  const lines: string[] = [];
  lines.push(`  ${pc.bold('Project')}:         ${pc.cyan(options.projectName)}`);
  lines.push(`  ${pc.bold('Template')}:        ${options.template === 'full' ? 'Full' : 'Minimal'}`);
  lines.push(`  ${pc.bold('Runtime')}:         ${options.runtime === 'node' ? 'Node.js' : options.runtime === 'bun' ? 'Bun' : 'Deno'}`);
  lines.push(`  ${pc.bold('Package manager')}: ${options.packageManager}`);
  lines.push(`  ${pc.bold('Bundler')}:         ${options.bundler === 'vite' ? 'Vite' : 'None'}`);
  lines.push(`  ${pc.bold('Tailwind CSS')}:    ${options.tailwind ? pc.green('Yes') : 'No'}`);
  lines.push(`  ${pc.bold('Git')}:             ${options.git ? pc.green('Yes') : 'No'}`);
  lines.push(`  ${pc.bold('Install deps')}:    ${options.install ? pc.green('Yes') : 'No'}`);
  return lines.join('\n');
}

export async function runPrompts(initialName?: string): Promise<SetupOptions> {
  console.log();
  console.log(pc.bold(pc.cyan('  ╔══════════════════════════════════╗')));
  console.log(pc.bold(pc.cyan('  ║                                  ║')));
  console.log(pc.bold(pc.cyan('  ║') + '     ⚡ ' + pc.white('bQuery Project Setup') + '  ⚡   ' + pc.cyan('║')));
  console.log(pc.bold(pc.cyan('  ║                                  ║')));
  console.log(pc.bold(pc.cyan('  ╚══════════════════════════════════╝')));
  console.log();

  p.intro(pc.inverse(' create-bquery '));

  // Step 1: Project name
  const projectName = assertNotCancelled(
    await p.text({
      message: 'What is your project name?',
      placeholder: 'my-bquery-app',
      initialValue: initialName,
      validate: (v) => getProjectNameValidationError(v),
    }),
  );

  // Step 2: Template
  const template = assertNotCancelled(
    await p.select<SetupTemplate>({
      message: 'Which template would you like to use?',
      options: [
        { value: 'full', label: 'Full', hint: 'Vite + TypeScript + all tooling' },
        { value: 'minimal', label: 'Minimal', hint: 'bare-bones TypeScript project' },
      ],
    }),
  );

  // Step 3: Runtime
  const runtime = assertNotCancelled(
    await p.select<Runtime>({
      message: 'Which runtime would you like to use?',
      options: [
        { value: 'node', label: 'Node.js', hint: 'stable, widely supported' },
        { value: 'bun', label: 'Bun', hint: 'fast, built-in TypeScript' },
        { value: 'deno', label: 'Deno', hint: 'secure, built-in TypeScript' },
      ],
    }),
  );

  // Step 4: Package manager (adaptive — reorder based on runtime)
  const packageManager = assertNotCancelled(
    await p.select<PackageManager>({
      message: 'Which package manager?',
      options: getPackageManagerOptions(runtime),
      initialValue: runtime === 'bun' ? 'bun' : 'npm',
    }),
  );

  // Step 5: Bundler (only ask for Node runtime; Bun/Deno have built-in bundling)
  let bundler: Bundler;
  if (runtime === 'node') {
    bundler = assertNotCancelled(
      await p.select<Bundler>({
        message: 'Add a bundler?',
        options: [
          { value: 'vite', label: 'Vite', hint: 'recommended for web projects' },
          { value: 'none', label: 'None', hint: 'for libraries or server-side projects' },
        ],
        initialValue: template === 'full' ? 'vite' : 'none',
      }),
    );
  } else {
    bundler = 'none';
    p.log.info(`Bundler: ${pc.dim('skipped')} ${pc.dim(`(${runtime === 'bun' ? 'Bun' : 'Deno'} has built-in bundling)`)}`);
  }

  // Step 6: Additional tools (only relevant for full template or Vite)
  let tailwind = false;
  if (template === 'full' || bundler === 'vite') {
    tailwind = assertNotCancelled(
      await p.confirm({
        message: 'Add Tailwind CSS?',
        initialValue: false,
      }),
    );
  }

  // Step 7: Git
  const git = assertNotCancelled(
    await p.confirm({
      message: 'Initialize a git repository?',
      initialValue: true,
    }),
  );

  // Step 8: Install
  const install = assertNotCancelled(
    await p.confirm({
      message: 'Install dependencies now?',
      initialValue: true,
    }),
  );

  const options: SetupOptions = {
    projectName: projectName as string,
    template,
    runtime,
    packageManager,
    bundler,
    tailwind,
    git,
    install,
  };

  // Summary and confirmation
  p.note(formatSummary(options), 'Project configuration');

  const confirmed = assertNotCancelled(
    await p.confirm({
      message: 'Proceed with this configuration?',
      initialValue: true,
    }),
  );

  if (!confirmed) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }

  return options;
}
