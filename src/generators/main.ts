import type { SetupOptions } from '../types.js';

export function generateMainFile(options: SetupOptions): string {
  const { runtime, bundler, tailwind } = options;

  if (bundler === 'vite') {
    return `${tailwind ? `import './styles.css'

` : ''}import '@bquery/ui'
import { $ } from '@bquery/bquery/core'

$('#app').html(\`
  <main>
    <h1>Hello bQuery!</h1>
    <p>Edit <code>src/main.ts</code> to get started.</p>
  </main>
\`)
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
