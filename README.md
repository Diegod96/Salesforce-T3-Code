# Salesforce T3 Code

A local-first Electron desktop app scaffold for Salesforce development.

## Stack

- Electron
- React
- TypeScript
- in-process agent service
- OpenAI Codex as first provider
- `simple-git` for Git operations
- core/domain architecture for future CPQ and NPSP support

## Prerequisites

- macOS
- Node.js 20+
- pnpm
- Git
- Salesforce CLI (`sf`)

## Quick start

```bash
cp .env.example .env
pnpm install
pnpm dev
```

`pnpm dev` picks the first free port starting at **5173** (or uses **`VITE_DEV_PORT`** if you set it), starts Vite on that port, and launches Electron against the same URL. If something else is already bound to 5173, the next free port is used automatically.

## Branching (GitFlow)

See [docs/gitflow.md](docs/gitflow.md) for branch roles (`main`, `develop`, `feature/*`, `release/*`, `hotfix/*`).
