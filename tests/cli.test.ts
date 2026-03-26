import { mkdtemp, mkdir, readdir, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import fse from 'fs-extra';
import { ensureTargetDirReady, isPathInsideBase, resolveNonInteractiveOptions } from '../src/cli.js';

const tempDirsToCleanup: string[] = [];

async function makeTempDir(): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'bquery-setup-'));
  tempDirsToCleanup.push(dir);
  return dir;
}

afterEach(async () => {
  await Promise.all(tempDirsToCleanup.splice(0).map((dir) => fse.remove(dir)));
});

describe('resolveNonInteractiveOptions', () => {
  it('uses template defaults when vite flag is omitted', () => {
    const options = resolveNonInteractiveOptions('my-app', {
      template: 'full',
      runtime: 'node',
      pm: 'npm',
    });

    expect(options.bundler).toBe('vite');
    expect(options.tailwind).toBe(false);
  });

  it('respects explicit false for vite in non-interactive mode', () => {
    const options = resolveNonInteractiveOptions('my-app', {
      template: 'full',
      runtime: 'node',
      pm: 'npm',
      vite: false,
    }, {
      vite: 'cli',
    });

    expect(options.bundler).toBe('none');
  });

  it('ignores default-sourced vite and tailwind values so template defaults still apply', () => {
    const options = resolveNonInteractiveOptions(
      'my-app',
      {
        template: 'minimal',
        runtime: 'node',
        pm: 'npm',
        vite: true,
        tailwind: true,
      },
      {
        vite: 'default',
        tailwind: 'default',
      },
    );

    expect(options.bundler).toBe('none');
    expect(options.tailwind).toBe(false);
  });
});

describe('ensureTargetDirReady', () => {
  it('rejects symlink target directories', async () => {
    const root = await makeTempDir();
    const cwd = path.join(root, 'cwd');
    const external = path.join(root, 'external');
    const targetLink = path.join(cwd, 'my-app');

    await mkdir(cwd);
    await mkdir(external);
    await symlink(external, targetLink, 'dir');

    await expect(ensureTargetDirReady('my-app', true, cwd)).rejects.toThrow('symbolic link');
  });

  it('clears existing directory contents when force is true', async () => {
    const root = await makeTempDir();
    const cwd = path.join(root, 'cwd');
    const targetDir = path.join(cwd, 'my-app');

    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, 'stale.txt'), 'stale');

    const readyDir = await ensureTargetDirReady('my-app', true, cwd);

    expect(readyDir).toBe(targetDir);
    await expect(readdir(targetDir)).resolves.toEqual([]);
  });
});

describe('isPathInsideBase', () => {
  it('accepts nested paths on the same Windows drive', () => {
    expect(isPathInsideBase('c:\\repo', 'C:\\repo\\my-app', path.win32)).toBe(true);
  });

  it('rejects paths on a different Windows drive', () => {
    expect(isPathInsideBase('C:\\repo', 'D:\\repo\\my-app', path.win32)).toBe(false);
  });
});
