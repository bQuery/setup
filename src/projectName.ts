import * as path from 'path';

const PROJECT_NAME_RE = /^[a-z0-9@][a-z0-9._@-]*$/i;

export function getProjectNameValidationError(projectName: string): string | undefined {
  if (projectName.length === 0) {
    return 'Project name is required';
  }

  if (
    path.isAbsolute(projectName) ||
    path.basename(projectName) !== projectName ||
    projectName === '.' ||
    projectName === '..'
  ) {
    return 'Project name must be a single folder name without path separators or ".." segments';
  }

  if (!PROJECT_NAME_RE.test(projectName)) {
    return 'Name must start with a letter, digit, or @ and only contain letters, digits, dots, hyphens, underscores, or @';
  }

  return undefined;
}
