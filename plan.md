# Salesforce Agent Desktop MVP Plan

## 1. Purpose

This document defines the implementation plan for a local-first Electron desktop
application for Salesforce development.

The product goal is to create a Salesforce-aware agent cockpit that can:

- open a Salesforce DX repository
- detect and manage connected orgs
- accept natural-language development tasks
- generate a plan before taking action
- edit local files safely
- run approved Salesforce CLI commands
- show diffs, logs, test results, and deploy results
- support Git workflows
- keep package-specific knowledge like CPQ and NPSP out of the core

This app is not intended to replace a full IDE in the MVP.

---

## 2. Product Thesis

Build a Salesforce-aware agent desktop app, not another general-purpose editor.

The product should combine:

- a lightweight desktop shell
- task-oriented agent workflows
- Salesforce DX-native execution via `sf`
- human review and approval for risky actions
- strong local auditability
- future domain packs for CPQ and NPSP

---

## 3. Finalized MVP Decisions

### Model provider

- First provider: OpenAI Codex

### Agent runtime

- Agent service runs in-process

### Git strategy

- Git operations use `simple-git`

### Platform scope

- Milestone 1 targets macOS first

---

## 4. MVP Goals

The MVP should allow a Salesforce developer to:

1. Open a Salesforce DX repo
2. Detect project structure and metadata locations
3. Discover available orgs through the Salesforce CLI
4. Select a target org for the task
5. Enter a task in natural language
6. Review an agent-generated plan
7. Approve local edits and approved CLI actions
8. Review diffs, logs, and test results
9. Commit changes to Git
10. Deploy to a scratch org or sandbox only

### Supported in MVP

- Apex
- Lightning Web Components
- SOQL
- Custom objects and fields
- Permission sets
- Layouts and tabs
- Git status, branch, diff, and commit
- Salesforce CLI:
  - org discovery
  - retrieve
  - deploy
  - Apex tests
  - SOQL query

### Explicitly out of scope for MVP

- Production deploys
- Destructive changes
- Arbitrary shell access for the agent
- Full Flow support
- Full Profile support
- Experience Cloud
- Deep managed-package editing
- Parallel multi-agent execution
- Rebuilding a complete code editor

---

## 5. Product Principles

- Local-first
- Safe by default
- Review before action
- Typed interfaces and tool contracts
- Salesforce CLI as the execution backbone
- Shared TypeScript types across UI and backend
- Core Salesforce support first
- CPQ and NPSP as domain packs, not core logic
- Clear audit trail for every agent run

---

## 6. Core Technical Decisions

### Application shell

- Electron
- TypeScript

### Frontend

- React
- Vite
- Zustand
- TanStack Query
- React Router
- Monaco Editor for diff/review
- xterm.js for terminal/log output

### Backend / local orchestration

- Node.js
- TypeScript
- Zod for schema validation
- better-sqlite3 for persistence
- node-pty for terminal sessions

### Tooling

- pnpm workspaces
- Turborepo
- ESLint
- Prettier
- Vitest

### Salesforce integration

- Salesforce CLI (`sf`)
- JSON-first command wrappers where possible

### Persistence

- SQLite for local state
- OS keychain for secrets via `keytar`

---

## 7. MVP Architecture

```text
Electron App
├─ Main Process
│  ├─ app lifecycle
│  ├─ native menus / dialogs
│  ├─ secure IPC
│  ├─ PTY management
│  ├─ keychain integration
│  └─ file system access
│
├─ Preload
│  └─ typed, minimal bridge to renderer
│
├─ Renderer
│  ├─ Projects UI
│  ├─ Orgs UI
│  ├─ Tasks UI
│  ├─ Plan / Approval UI
│  ├─ Review / Diff UI
│  ├─ Logs / Artifacts UI
│  └─ Settings UI
│
└─ In-Process Agent Service
   ├─ task orchestration
   ├─ context builder
   ├─ tool execution
   ├─ provider abstraction
   ├─ policy engine
   ├─ persistence
   └─ domain routing