---
description: Create a detailed checkpoint commit with all current changes
---

# Checkpoint

Creates a well-structured commit capturing all current work.

## Steps

### 1. Pre-commit Validation

```bash
pnpm lint && pnpm typecheck
```

If either fails, fix the issues first. Do not commit broken code.

### 2. Analyze Changes

```bash
git status
git diff --stat
git log -5 --oneline
```

Understand what changed, how many files, and the existing commit style.

### 3. Stage Everything

```bash
git add -A
```

### 4. Determine Commit Type

Based on the changes, pick the right prefix:
- `feat:` — new feature or functionality
- `fix:` — bug fix
- `refactor:` — code restructuring without behavior change
- `docs:` — documentation only
- `chore:` — config, dependencies, tooling
- `style:` — formatting, no logic change

### 5. Create Commit

```bash
git commit -m "{type}: {concise summary}" -m "
{Detailed description of changes}

Files changed: {count}
- {key files and what changed in each}

Co-authored-by: Claude <noreply@anthropic.com>"
```

**First line**: imperative mood, 50-72 chars (e.g., "feat: add user profile page")
**Body**: what changed and why, with file-level detail

### 6. Report

```
✅ Checkpoint created

{commit hash} {type}: {summary}
{file count} files changed

Push with: git push
```
