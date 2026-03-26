import fse from 'fs-extra';
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
  await fse.ensureDir(targetDir);
  await fse.ensureDir(path.join(targetDir, 'src'));

  // 2. Write package.json
  const pkgJson = generatePackageJson(options);
  await fse.writeJson(path.join(targetDir, 'package.json'), pkgJson, { spaces: 2 });

  // 3. Write tsconfig.json
  const tsConfig = generateTsConfig(options);
  await fse.writeJson(path.join(targetDir, 'tsconfig.json'), tsConfig, { spaces: 2 });

  // 4. Write .gitignore
  await fse.writeFile(path.join(targetDir, '.gitignore'), generateGitignore(options));

  // 5. Write README.md
  await fse.writeFile(path.join(targetDir, 'README.md'), generateReadme(options));

  // 6. Write main source file
  const mainFileName = getMainFileName(options);
  await fse.writeFile(path.join(targetDir, 'src', mainFileName), generateMainFile(options));

  // 7. Vite-specific files (for projects using the Vite bundler)
  if (options.bundler === 'vite') {
    await fse.writeFile(path.join(targetDir, 'vite.config.ts'), generateViteConfig());
    await fse.writeFile(path.join(targetDir, 'index.html'), generateHtml(options.projectName));
  }

  // 8. Tailwind-specific files
  if (options.tailwind) {
    await fse.writeFile(path.join(targetDir, 'tailwind.config.js'), generateTailwindConfig());
    await fse.writeFile(path.join(targetDir, 'postcss.config.js'), generatePostcssConfig());
    await fse.writeFile(path.join(targetDir, 'src', 'styles.css'), generateTailwindStyles());
  }
}
