import { Command } from 'commander';
import { execSync } from 'child_process';
import * as path from 'path';
import pc from 'picocolors';
import { generateProject } from './generators/index.js';
import { runPrompts } from './prompts.js';
import type { SetupOptions, Bundler, PackageManager, Runtime, SetupTemplate } from './types.js';

function getInstallCommand(pm: PackageManager): string {
  switch (pm) {
    case 'yarn':
      return 'yarn';
    case 'pnpm':
      return 'pnpm install';
    case 'bun':
      return 'bun install';
    default:
      return 'npm install';
  }
}

export function createCli(): Command {
  const program = new Command();

  program
    .name('create-bquery')
    .description('Set up a local bQuery project')
    .version('0.1.0')
    .argument('[project-name]', 'Name of the project to create')
    .option('-t, --template <type>', 'Template type: full | minimal', 'full')
    .option('-r, --runtime <type>', 'Runtime: node | bun | deno', 'node')
    .option('-p, --pm <type>', 'Package manager: npm | pnpm | yarn | bun', 'npm')
    .option('--vite', 'Include Vite bundler')
    .option('--no-vite', 'Exclude Vite bundler')
    .option('--tailwind', 'Include Tailwind CSS')
    .option('--no-tailwind', 'Exclude Tailwind CSS')
    .option('--git', 'Initialize git repository', true)
    .option('--no-git', 'Skip git initialization')
    .option('--install', 'Run package install after setup', true)
    .option('--no-install', 'Skip package installation')
    .option('-y, --yes', 'Skip prompts, use defaults')
    .action(async (projectName: string | undefined, opts: Record<string, unknown>) => {
      try {
        let options: SetupOptions;

        const useDefaults = opts.yes === true;

        if (useDefaults || (projectName !== undefined && opts.yes === true)) {
          // Non-interactive mode: build options from CLI args
          const template = (opts.template as SetupTemplate) ?? 'full';
          const runtime = (opts.runtime as Runtime) ?? 'node';
          const packageManager = (opts.pm as PackageManager) ?? 'npm';

          // Determine bundler from flags
          let bundler: Bundler;
          if (opts.vite === true) {
            bundler = 'vite';
          } else if (opts.vite === false) {
            bundler = 'none';
          } else {
            bundler = template === 'full' ? 'vite' : 'none';
          }

          options = {
            projectName: projectName ?? 'my-bquery-app',
            template,
            runtime,
            packageManager,
            bundler,
            tailwind: (opts.tailwind as boolean) ?? false,
            git: (opts.git as boolean) ?? true,
            install: (opts.install as boolean) ?? true,
          };
        } else {
          // Interactive mode
          options = await runPrompts(projectName);
        }

        const targetDir = path.resolve(process.cwd(), options.projectName);

        console.log(pc.cyan(`\nCreating project in ${targetDir}...`));
        await generateProject(options, targetDir);
        console.log(pc.green('✓ Project files generated'));

        if (options.git) {
          try {
            execSync('git init', { cwd: targetDir, stdio: 'pipe' });
            console.log(pc.green('✓ Git repository initialized'));
          } catch {
            console.log(pc.yellow('⚠ Could not initialize git repository'));
          }
        }

        if (options.install) {
          try {
            const installCmd = getInstallCommand(options.packageManager);
            console.log(pc.cyan(`\nRunning ${installCmd}...`));
            execSync(installCmd, { cwd: targetDir, stdio: 'inherit' });
            console.log(pc.green('✓ Dependencies installed'));
          } catch {
            console.log(pc.yellow('⚠ Could not install dependencies. Run them manually.'));
          }
        }

        console.log(pc.green(`\n✓ Project ${options.projectName} created successfully!`));
        console.log(pc.dim(`\nNext steps:`));
        console.log(pc.dim(`  cd ${options.projectName}`));
        if (!options.install) {
          console.log(pc.dim(`  ${getInstallCommand(options.packageManager)}`));
        }
      } catch (err) {
        console.error(pc.red('Error creating project:'), err);
        process.exit(1);
      }
    });

  return program;
}
