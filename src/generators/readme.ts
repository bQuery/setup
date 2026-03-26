import type { SetupOptions } from '../types.js';

export function generateReadme(options: SetupOptions): string {
  const { projectName, runtime, packageManager, bundler, tailwind } = options;
  const runCmd = packageManager === 'yarn' ? 'yarn' : `${packageManager} run`;

  const installCmd =
    packageManager === 'yarn'
      ? 'yarn'
      : packageManager === 'pnpm'
        ? 'pnpm install'
        : packageManager === 'bun'
          ? 'bun install'
          : 'npm install';

  const scripts: string[] = [];

  if (runtime === 'bun') {
    scripts.push('- `bun run dev` — start dev server with watch');
    scripts.push('- `bun run start` — run the project');
    scripts.push('- `bun run build` — build the project');
    scripts.push('- `bun test` — run tests');
  } else if (runtime === 'deno') {
    scripts.push(`- \`${runCmd} dev\` — start dev server with watch`);
    scripts.push(`- \`${runCmd} start\` — run the project`);
    scripts.push(`- \`${runCmd} test\` — run tests`);
  } else {
    if (bundler === 'vite') {
      scripts.push(`- \`${runCmd} dev\` — start Vite dev server`);
      scripts.push(`- \`${runCmd} build\` — build for production`);
      scripts.push(`- \`${runCmd} preview\` — preview production build`);
      scripts.push(`- \`${runCmd} test\` — run tests`);
      scripts.push(`- \`${runCmd} lint\` — type check`);
    } else {
      scripts.push(`- \`${runCmd} dev\` — run with ts-node`);
      scripts.push(`- \`${runCmd} build\` — compile TypeScript`);
      scripts.push(`- \`${runCmd} start\` — run compiled output`);
      scripts.push(`- \`${runCmd} lint\` — type check`);
    }
  }

  const stack = [`- **Runtime**: ${runtime}`, `- **Language**: TypeScript`];
  if (bundler === 'vite') stack.push('- **Bundler**: Vite');
  if (tailwind) stack.push('- **Styling**: Tailwind CSS');
  stack.push(`- **Package Manager**: ${packageManager}`);

  return `# ${projectName}

A bQuery project.

## Installation

\`\`\`bash
${installCmd}
\`\`\`

## Scripts

${scripts.join('\n')}

## Stack

${stack.join('\n')}
`;
}
