# GitFlow branching

This repo follows a lightweight [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/) style.

| Branch | Purpose |
| --- | --- |
| `main` | Production-ready history; only merges from `release/*` or `hotfix/*`. |
| `develop` | Integration branch; default target for features. |
| `feature/*` | Branched from `develop`; merge back via PR into `develop`. |
| `release/*` | Branched from `develop` when cutting a version; only fixes + version bumps; merge to `main` and back to `develop`. |
| `hotfix/*` | Branched from `main` for urgent production fixes; merge to `main` and `develop`. |

Typical flow: `develop` → `feature/my-change` → PR → `develop` → (release branch) → `main`.

Command-line examples:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-change
# ... commit ...
git push -u origin feature/my-change
```

After review, merge the feature branch into `develop` (merge commit or squash, per team preference).
