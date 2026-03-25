import type { SetupOptions } from '../types.js';

export function generateMainFile(options: SetupOptions): string {
  const { runtime, bundler } = options;

  if (bundler === 'vite') {
    return `const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = \`
  <h1>Hello bQuery!</h1>
  <p>Edit <code>src/main.ts</code> to get started.</p>
\`
`;
  }

  if (runtime === 'bun') {
    return `console.log('Hello from bQuery! (Bun)')
`;
  }

  if (runtime === 'deno') {
    return `console.log('Hello from bQuery! (Deno)')
`;
  }

  // Node
  return `console.log('Hello from bQuery!')
`;
}

export function getMainFileName(options: SetupOptions): string {
  return options.bundler === 'vite' ? 'main.ts' : 'index.ts';
}
