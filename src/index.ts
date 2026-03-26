#!/usr/bin/env node
import { createCli } from './cli.js';

const program = createCli();

async function main(): Promise<void> {
  await program.parseAsync();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
