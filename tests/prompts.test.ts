import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SetupOptions } from '../src/types.js';

const promptMocks = vi.hoisted(() => ({
  text: vi.fn(),
  select: vi.fn(),
  confirm: vi.fn(),
  intro: vi.fn(),
  note: vi.fn(),
  cancel: vi.fn(),
  isCancel: vi.fn(() => false),
  log: {
    info: vi.fn(),
  },
}));

vi.mock('@clack/prompts', () => promptMocks);

import { runPrompts } from '../src/prompts.js';

describe('runPrompts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    promptMocks.isCancel.mockReturnValue(false);
    promptMocks.text.mockResolvedValue('valid-app');
    promptMocks.select
      .mockResolvedValueOnce('full')
      .mockResolvedValueOnce('node')
      .mockResolvedValueOnce('npm')
      .mockResolvedValueOnce('vite');
    promptMocks.confirm
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);
  });

  it('validates and prompts even when an initial project name is provided', async () => {
    const options = (await runPrompts('Invalid-Name')) as SetupOptions;

    expect(promptMocks.text).toHaveBeenCalledTimes(1);
    expect(promptMocks.text).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValue: 'Invalid-Name',
        message: 'What is your project name?',
      }),
    );

    const promptConfig = promptMocks.text.mock.calls[0]?.[0] as { validate: (value: string) => string | undefined };
    expect(promptConfig.validate('Invalid-Name')).toContain('lowercase');
    expect(options.projectName).toBe('valid-app');
  });
});
