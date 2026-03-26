import * as path from 'path';

const PROJECT_NAME_RE = /^[a-z0-9][a-z0-9._-]*$/;
const RESERVED_PACKAGE_NAMES = new Set(['node_modules', 'favicon.ico']);

export function getProjectNameValidationError(projectName: string): string | undefined {
  if (projectName.length === 0) {
    return 'Project name is required';
  }

  if (projectName.length > 214) {
    return 'Project name must be 214 characters or fewer';
  }

  if (
    path.isAbsolute(projectName) ||
    path.basename(projectName) !== projectName ||
    projectName === '.' ||
    projectName === '..'
  ) {
    return 'Project name must be a single folder name without path separators or ".." segments';
  }

  if (RESERVED_PACKAGE_NAMES.has(projectName)) {
    return `Project name "${projectName}" is reserved and cannot be used`;
  }

  if (!PROJECT_NAME_RE.test(projectName)) {
    return 'Project name must be lowercase and use only letters, digits, dots, hyphens, or underscores';
  }

  return undefined;
}
