# @bquery/setup

`@bquery/setup` is a TypeScript CLI that scaffolds a local bQuery project with sensible defaults for Node.js, Bun, or Deno.

It supports both an interactive setup wizard and a non-interactive mode for repeatable automation.

## Features

- Interactive onboarding flow with guided prompts
- Non-interactive mode for CI, scripts, and quick starts
- Project templates for **full** and **minimal** setups
- Runtime selection for **Node.js**, **Bun**, and **Deno**
- Optional **Vite** setup for Node-based web projects
- Optional **Tailwind CSS** integration when supported
- Optional Git initialization and dependency installation
- Safe target-directory checks with `--force` support

## Requirements

- Node.js **20+** to run this CLI package (generated Node.js projects target Node.js **18+** via their `engines.node` field)
- npm, pnpm, yarn, or bun available if you want the tool to install dependencies automatically
- Git installed if you want the tool to initialize a repository

## Installation

### Global install

```bash
npm install -g @bquery/setup
```

Then run either binary:

```bash
create-bquery my-app
```

or:

```bash
bquery-setup my-app
```

### One-off usage without a global install

```bash
npx --package @bquery/setup create-bquery my-app
```

## Quick start

### Interactive mode

Run the CLI without `--yes` to use the guided setup wizard:

```bash
create-bquery
```

You will be asked for:

1. project name
2. template
3. runtime
4. package manager
5. bundler selection for Node.js projects
6. Tailwind CSS preference when available
7. Git initialization
8. dependency installation
9. final confirmation

When you use the interactive wizard, the prompt flow decides the template, runtime, package manager, bundler, Tailwind, Git, and install settings. CLI flags for those options are only applied in non-interactive mode with `--yes`. Without `--yes`, a provided `[project-name]` is used only as the initial project-name value in the prompt.

### Non-interactive mode

Use `--yes` to skip prompts and rely on CLI flags and defaults:

```bash
create-bquery my-app --yes
```

Example with explicit configuration:

```bash
create-bquery my-app \
  --yes \
  --template full \
  --runtime node \
  --pm pnpm \
  --vite \
  --tailwind \
  --git \
  --install
```

## Usage

```bash
create-bquery [project-name] [options]
```

### Arguments

| Argument | Description |
| --- | --- |
| `[project-name]` | Optional target folder name. Defaults to `my-bquery-app` in non-interactive mode. |

### Options

| Option | Description | When omitted with `--yes` |
| --- | --- | --- |
| `-t, --template <type>` | Template type: `full` or `minimal` | `full` |
| `-r, --runtime <type>` | Runtime: `node`, `bun`, or `deno` | `node` |
| `-p, --pm <type>` | Package manager: `npm`, `pnpm`, `yarn`, or `bun` | `npm` |
| `--vite` | Force Vite bundler on for Node.js projects | `full + node` resolves to Vite |
| `--no-vite` | Force Vite bundler off | `minimal + node`, `bun`, and `deno` resolve to no bundler |
| `--tailwind` | Enable Tailwind CSS when supported | `false` |
| `--no-tailwind` | Disable Tailwind CSS | - |
| `--git` | Initialize a Git repository | `true` |
| `--no-git` | Skip Git initialization | - |
| `--install` | Install dependencies after scaffolding | `true` |
| `--no-install` | Skip dependency installation | - |
| `-f, --force` | Clear an existing target directory before scaffolding | `false` |
| `-y, --yes` | Skip prompts and use defaults/flags directly | `false` |
| `--version` | Print the CLI version | - |
| `--help` | Show help output | - |

Defaults in this table apply to non-interactive mode with `--yes`. Without `--yes`, the interactive prompt flow asks you to choose these values instead.

## Configuration behavior

The CLI applies a few rules so generated projects stay consistent.

### Templates

- `full`: geared toward a richer project setup and defaults to **Vite** on Node.js
- `minimal`: a smaller TypeScript scaffold and defaults to **no bundler**

### Runtimes

- `node`: supports either **Vite** or **no bundler**
- `bun`: always uses **no external bundler**
- `deno`: always uses **no external bundler**

### Bundler rules

- Vite is only relevant for **Node.js** projects
- Bun and Deno skip the bundler step because they already have built-in tooling
- In non-interactive mode:
  - `full + node` defaults to `vite`
  - `minimal + node` defaults to `none`
  - `bun` and `deno` always resolve to `none`

### Tailwind CSS rules

Tailwind is only enabled when the interactive flow would offer it:

- any **full** template
- any project using **Vite**

That means `--tailwind` is ignored for unsupported combinations such as:

- `minimal + node + --no-vite`
- `minimal + bun`
- `minimal + deno`

### Package manager behavior

The CLI supports `npm`, `pnpm`, `yarn`, and `bun`.

In the interactive wizard, Bun is shown as the recommended first choice when the selected runtime is Bun.

## Supported combinations

| Runtime | Template | Bundler | Tailwind available |
| --- | --- | --- | --- |
| Node.js | full | Vite by default, can be disabled | Yes |
| Node.js | minimal | None by default, Vite optional | Yes, when Vite is enabled |
| Bun | full | None | Yes |
| Bun | minimal | None | No |
| Deno | full | None | Yes |
| Deno | minimal | None | No |

## What gets generated

Every scaffolded project includes:

- `package.json`
- `tsconfig.json`
- `.gitignore`
- `README.md`
- `src/` entry file

Depending on the selected options, it may also include:

- `vite.config.ts`
- `index.html`
- `tailwind.config.js`
- `postcss.config.js`
- `src/styles.css`

### Entry file by setup

- Vite projects use `src/main.ts`
- All other setups use `src/index.ts`

## Generated project scripts

The generated `package.json` scripts depend on the runtime and whether Vite/Tailwind are enabled.

### Node.js + Vite

- `dev` — runs `vite`
- `build` — runs `tsc && vite build`
- `preview` — runs `vite preview`
- `test` — runs `vitest`
- `lint` — runs `tsc --noEmit`
- `build:css` — runs `tailwindcss -i src/styles.css -o dist/styles.css` when Tailwind is enabled

### Node.js without Vite

- `dev` — runs `ts-node src/index.ts` (or `ts-node --esm src/index.ts` when Tailwind is enabled)
- `build` — runs `tsc`
- `start` — runs `node dist/index.js`
- `lint` — runs `tsc --noEmit`
- `build:css` — runs `tailwindcss -i src/styles.css -o dist/styles.css` when Tailwind is enabled

### Bun

- `dev` — runs `bun run --watch src/index.ts`
- `start` — runs `bun run src/index.ts`
- `build` — runs `bun build src/index.ts --outdir dist`
- `test` — runs `bun test`
- `build:css` — runs `tailwindcss -i src/styles.css -o dist/styles.css` when Tailwind is enabled

### Deno

- `dev` — runs `deno run --watch src/index.ts`
- `start` — runs `deno run src/index.ts`
- `test` — runs `deno test`
- `build:css` — runs `tailwindcss -i src/styles.css -o dist/styles.css` when Tailwind is enabled

Deno projects do not include a `build` script.

## Project name rules

Project names must:

- be a single folder name
- not contain path separators
- not be `.` or `..`
- start with a lowercase letter or digit
- only use lowercase letters, digits, `.`, `-`, or `_`
- not use reserved names such as `node_modules` or `favicon.ico`

## Examples

### Full Node.js app with Vite and Tailwind

```bash
create-bquery my-web-app --yes --template full --runtime node --pm pnpm --vite --tailwind
```

### Minimal Node.js project without a bundler

```bash
create-bquery my-service --yes --template minimal --runtime node --no-vite
```

### Bun project with recommended package manager

```bash
create-bquery my-bun-app --yes --runtime bun --pm bun
```

### Deno project without dependency installation

```bash
create-bquery my-deno-app --yes --runtime deno --no-install
```

## Typical workflow after scaffolding

If you choose `--no-install`, install dependencies yourself:

```bash
cd my-app
npm install
npm run dev
```

The exact install and dev command shown by the CLI depends on your selected package manager.

## Local development

To work on this CLI itself:

```bash
npm install
npm run typecheck
npm test
npm run build
```

Available scripts in this repository:

- `npm run dev` — watch and rebuild the CLI with `tsup`
- `npm run typecheck` — run TypeScript checking without emit
- `npm test` — run the Vitest suite
- `npm run build` — build the CLI into `dist/`

## Notes

- The CLI writes files into a project directory inside your current working directory.
- Existing non-empty target directories are rejected unless you pass `--force`.
- If package installation or Git initialization fails, scaffolding still completes and the CLI prints the next steps you can run manually.
