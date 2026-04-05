#!/usr/bin/env bash
set -euo pipefail

DEFAULT_ROOT="$HOME/Developer/Salesforce-T3-Code"

if [[ "${USE_PWD:-0}" == "1" ]]; then
  ROOT_DIR="${ROOT_DIR:-$PWD}"
else
  ROOT_DIR="${ROOT_DIR:-$DEFAULT_ROOT}"
fi

FORCE="${FORCE:-0}"

if [[ ! -d "$ROOT_DIR" ]]; then
  echo "Target folder does not exist: $ROOT_DIR"
  echo "Create it first, or set ROOT_DIR to an existing folder."
  exit 1
fi

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Warning: this scaffold is currently tuned for macOS."
fi

write_file() {
  local file_path="$1"

  if [[ -e "$file_path" && "$FORCE" != "1" ]]; then
    echo "Skipping existing file: $file_path"
    return
  fi

  mkdir -p "$(dirname "$file_path")"
  cat >"$file_path"
  echo "Wrote: $file_path"
}

mkdir -p \
  "$ROOT_DIR/apps/desktop/src/main" \
  "$ROOT_DIR/apps/desktop/src/preload" \
  "$ROOT_DIR/apps/renderer/src/app" \
  "$ROOT_DIR/apps/renderer/src/routes" \
  "$ROOT_DIR/apps/renderer/src/features/projects" \
  "$ROOT_DIR/apps/renderer/src/features/orgs" \
  "$ROOT_DIR/apps/renderer/src/features/tasks" \
  "$ROOT_DIR/apps/renderer/src/features/review" \
  "$ROOT_DIR/apps/renderer/src/features/logs" \
  "$ROOT_DIR/apps/renderer/src/features/settings" \
  "$ROOT_DIR/apps/agent-service/src/runtime" \
  "$ROOT_DIR/apps/agent-service/src/context" \
  "$ROOT_DIR/packages/shared/src/types" \
  "$ROOT_DIR/packages/shared/src/schemas" \
  "$ROOT_DIR/packages/salesforce-core/src/project" \
  "$ROOT_DIR/packages/salesforce-core/src/cli" \
  "$ROOT_DIR/packages/salesforce-core/src/orgs" \
  "$ROOT_DIR/packages/tool-filesystem/src" \
  "$ROOT_DIR/packages/tool-git/src" \
  "$ROOT_DIR/packages/tool-salesforce-cli/src" \
  "$ROOT_DIR/packages/policy-engine/src" \
  "$ROOT_DIR/packages/persistence-sqlite/src" \
  "$ROOT_DIR/packages/domain-cpq/src" \
  "$ROOT_DIR/packages/domain-npsp/src" \
  "$ROOT_DIR/configs/typescript" \
  "$ROOT_DIR/configs/prettier" \
  "$ROOT_DIR/configs/eslint" \
  "$ROOT_DIR/.github/workflows"

write_file "$ROOT_DIR/.gitignore" <<'EOF'
node_modules
.pnpm-store
.turbo
dist
build
coverage
.DS_Store
.env
.env.local
*.log
*.db
EOF

write_file "$ROOT_DIR/.env.example" <<'EOF'
OPENAI_API_KEY=
OPENAI_MODEL=codex
EOF

write_file "$ROOT_DIR/package.json" <<'EOF'
{
  "name": "salesforce-t3-code",
  "private": true,
  "packageManager": "pnpm@10",
  "scripts": {
    "dev": "turbo run dev --parallel --filter=@salesforce-agent/renderer --filter=@salesforce-agent/desktop",
    "build": "pnpm --filter @salesforce-agent/shared build && pnpm --filter @salesforce-agent/salesforce-core build && pnpm --filter @salesforce-agent/agent-service build && pnpm --filter @salesforce-agent/renderer build && pnpm --filter @salesforce-agent/desktop build",
    "typecheck": "turbo run typecheck",
    "format": "prettier --write .",
    "clean": "rm -rf .turbo node_modules apps/*/dist packages/*/dist"
  },
  "devDependencies": {
    "prettier": "latest",
    "turbo": "latest",
    "typescript": "latest"
  }
}
EOF

write_file "$ROOT_DIR/pnpm-workspace.yaml" <<'EOF'
packages:
  - "apps/*"
  - "packages/*"
  - "configs/*"
EOF

write_file "$ROOT_DIR/turbo.json" <<'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    }
  }
}
EOF

write_file "$ROOT_DIR/configs/typescript/base.json" <<'EOF'
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "noEmit": false,
    "outDir": "dist",
    "lib": ["ES2022"]
  }
}
EOF

write_file "$ROOT_DIR/configs/typescript/react.json" <<'EOF'
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["DOM", "DOM.Iterable", "ES2022"]
  }
}
EOF

write_file "$ROOT_DIR/configs/prettier/prettier.config.cjs" <<'EOF'
module.exports = {
  printWidth: 80,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
};
EOF

write_file "$ROOT_DIR/configs/eslint/base.cjs" <<'EOF'
module.exports = {
  root: true,
};
EOF

write_file "$ROOT_DIR/README.md" <<'EOF'
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