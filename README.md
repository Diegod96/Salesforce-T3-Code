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
