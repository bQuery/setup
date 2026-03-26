import type { SetupOptions } from '../types.js';

export function generateGitignore(_options: SetupOptions): string {
  return `# Dependencies
node_modules/
.pnp
.pnp.js

# Build output
dist/
build/
out/

# Environment files
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor directories
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS files
.DS_Store
Thumbs.db

# Test coverage
coverage/
.nyc_output/

# Vite cache
.vite/

# TypeScript cache
*.tsbuildinfo
`;
}
