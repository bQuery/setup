import * as fs from 'fs-extra';
import * as path from 'path';
import type { SetupOptions } from '../types.js';
import { generatePackageJson } from './packageJson.js';
import { generateTsConfig } from './tsconfig.js';
import { generateViteConfig } from './vite.js';
import { generateTailwindConfig, generatePostcssConfig, generateTailwindStyles } from './tailwind.js';
import { generateHtml } from './html.js';
import { generateReadme } from './readme.js';
import { generateGitignore } from './gitignore.js';
import { generateMainFile, getMainFileName } from './main.js';

export async function generateProject(options: SetupOptions, targetDir: string): Promise<void> {
  // 1. Create target directory
  await fs.ensureDir(targetDir);
  await fs.ensureDir(path.join(targetDir, 'src'));

  // 2. Write package.json
  const pkgJson = generatePackageJson(options);
  await fs.writeJson(path.join(targetDir, 'package.json'), pkgJson, { spaces: 2 });

  // 3. Write tsconfig.json
  const tsConfig = generateTsConfig(options);
  await fs.writeJson(path.join(targetDir, 'tsconfig.json'), tsConfig, { spaces: 2 });

  // 4. Write .gitignore
  await fs.writeFile(path.join(targetDir, '.gitignore'), generateGitignore(options));

  // 5. Write README.md
  await fs.writeFile(path.join(targetDir, 'README.md'), generateReadme(options));

  // 6. Write main source file
  const mainFileName = getMainFileName(options);
  await fs.writeFile(path.join(targetDir, 'src', mainFileName), generateMainFile(options));

  // 7. Vite-specific files (only for full template + vite bundler)
  if (options.bundler === 'vite') {
    await fs.writeFile(path.join(targetDir, 'vite.config.ts'), generateViteConfig());
    await fs.writeFile(path.join(targetDir, 'index.html'), generateHtml(options.projectName));
  }

  // 8. Tailwind-specific files
  if (options.tailwind) {
    await fs.writeFile(path.join(targetDir, 'tailwind.config.js'), generateTailwindConfig());
    await fs.writeFile(path.join(targetDir, 'postcss.config.js'), generatePostcssConfig());
    await fs.writeFile(path.join(targetDir, 'src', 'styles.css'), generateTailwindStyles());
  }
}
