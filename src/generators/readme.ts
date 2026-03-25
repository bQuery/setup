import type { SetupOptions } from '../types.js';

export function generateReadme(options: SetupOptions): string {
  const { projectName, runtime, packageManager, bundler, tailwind } = options;

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
    scripts.push('- `deno task dev` — start dev server with watch');
    scripts.push('- `deno task start` — run the project');
    scripts.push('- `deno test` — run tests');
  } else {
    if (bundler === 'vite') {
      scripts.push(`- \`${packageManager === 'yarn' ? 'yarn' : packageManager + ' run'} dev\` — start Vite dev server`);
      scripts.push(`- \`${packageManager === 'yarn' ? 'yarn' : packageManager + ' run'} build\` — build for production`);
      scripts.push(`- \`${packageManager === 'yarn' ? 'yarn' : packageManager + ' run'} preview\` — preview production build`);
      scripts.push(`- \`${packageManager === 'yarn' ? 'yarn' : packageManager + ' run'} test\` — run tests`);
      scripts.push(`- \`${packageManager === 'yarn' ? 'yarn' : packageManager + ' run'} lint\` — type check`);
    } else {
      scripts.push(`- \`${packageManager === 'yarn' ? 'yarn' : packageManager + ' run'} dev\` — run with ts-node`);
      scripts.push(`- \`${packageManager === 'yarn' ? 'yarn' : packageManager + ' run'} build\` — compile TypeScript`);
      scripts.push(`- \`${packageManager === 'yarn' ? 'yarn' : packageManager + ' run'} start\` — run compiled output`);
      scripts.push(`- \`${packageManager === 'yarn' ? 'yarn' : packageManager + ' run'} lint\` — type check`);
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
