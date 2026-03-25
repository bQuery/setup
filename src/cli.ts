import { Command } from 'commander';
import { execSync } from 'child_process';
import * as path from 'path';
import * as p from '@clack/prompts';
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

function getDevCommand(pm: PackageManager): string {
  switch (pm) {
    case 'yarn':
      return 'yarn dev';
    case 'pnpm':
      return 'pnpm dev';
    case 'bun':
      return 'bun dev';
    default:
      return 'npm run dev';
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

        if (useDefaults) {
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
          // Interactive mode — guided onboarding
          options = await runPrompts(projectName);
        }

        const targetDir = path.resolve(process.cwd(), options.projectName);

        // Generate project with spinner
        const spin = p.spinner();
        spin.start('Scaffolding project...');

        await generateProject(options, targetDir);

        spin.stop('Project files generated');

        // Git init
        if (options.git) {
          const gitSpin = p.spinner();
          gitSpin.start('Initializing git repository...');
          try {
            execSync('git init', { cwd: targetDir, stdio: 'pipe' });
            gitSpin.stop('Git repository initialized');
          } catch {
            gitSpin.stop(pc.yellow('Could not initialize git repository'));
          }
        }

        // Install deps
        if (options.install) {
          const installCmd = getInstallCommand(options.packageManager);
          const installSpin = p.spinner();
          installSpin.start(`Running ${installCmd}...`);
          try {
            execSync(installCmd, { cwd: targetDir, stdio: 'pipe' });
            installSpin.stop('Dependencies installed');
          } catch (installErr) {
            installSpin.stop(pc.yellow('Could not install dependencies'));
            const msg = installErr instanceof Error ? installErr.message : String(installErr);
            p.log.warn(msg);
            p.log.info('You can install dependencies manually after setup.');
          }
        }

        // Final next-steps
        const nextSteps: string[] = [];
        nextSteps.push(`cd ${options.projectName}`);
        if (!options.install) {
          nextSteps.push(getInstallCommand(options.packageManager));
        }
        nextSteps.push(getDevCommand(options.packageManager));

        p.note(nextSteps.map((s) => pc.cyan(s)).join('\n'), 'Next steps');
        p.outro(pc.green(`You're all set! Happy hacking 🚀`));
      } catch (err) {
        p.cancel('Error creating project');
        console.error(err);
        process.exit(1);
      }
    });

  return program;
}
