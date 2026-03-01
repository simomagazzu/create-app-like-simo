---
description: Publish a feature spec to GitHub Issues and Projects
---

# Publish to GitHub

Creates GitHub Issues, a Project board, and labels from a feature spec.

## Prerequisites

- GitHub CLI authenticated: `gh auth status`
- Project scopes: `gh auth refresh -s project,read:project`
- Feature folder exists in `/specs/{feature-name}/` with `requirements.md` and `implementation-plan.md`

## Steps

### 1. Identify the Feature

Find the feature folder. If multiple exist, ask the user which one.

### 2. Extract Info

- **Feature name**: folder name (e.g., `user-dashboard`)
- **Feature title**: main heading from `requirements.md`
- **Phases**: parse from `implementation-plan.md`

### 3. Get Repository Info

```bash
gh repo view --json nameWithOwner,owner -q '.nameWithOwner + " " + .owner.login'
```

Store as `{repository}` and `{owner}`.

### 4. Create Labels

```bash
gh label create "epic" --color "7057ff" --description "Feature epic" 2>/dev/null || true
gh label create "feature/{feature-name}" --color "0E8A16" --description "Feature: {title}" 2>/dev/null || true
```

Create `phase-N` labels for each phase.

### 5. Create Epic Issue

Create one issue with the full requirements as the body. Label it `epic` and `feature/{feature-name}`.

### 6. Create Phase Issues

For each phase, create an issue with:
- Title: `Phase {N}: {Phase Title}`
- Body: phase description + task checklist
- Labels: `feature/{feature-name}`, `phase-{n}`

For tasks marked `[complex]`, create separate issues linked to the phase.

### 7. Create GitHub Project

```bash
gh project create --owner {owner} --title "Feature: {feature-title}" --format json
```

Add all issues to the project.

### 8. Cache Project IDs

Query project field IDs and option IDs once, then store them:

```bash
gh project field-list {project_number} --owner {owner} --format json
```

Extract: `project_id`, `status_field_id`, `in_progress_option_id`, `done_option_id`

### 9. Write `github.md`

Create `specs/{feature-name}/github.md`:

```markdown
---
feature_name: {feature-name}
epic_issue: {number}
repository: {repository}
owner: {owner}
project_number: {number}
project_id: "{id}"
status_field_id: "{id}"
in_progress_option_id: "{id}"
done_option_id: "{id}"
---

# GitHub References

- **Epic**: https://github.com/{repository}/issues/{epic}
- **Project**: https://github.com/users/{owner}/projects/{number}

## Phase Issues
| Phase | Issue | Status |
|-------|-------|--------|
| Phase 1: {title} | #{n} | Open |
| Phase 2: {title} | #{n} | Open |
```

### 10. Report

```
✅ Feature published to GitHub!

Epic: #{epic_issue}
Project: https://github.com/users/{owner}/projects/{number}
Phase issues: {count} created

Project IDs cached in github.md for fast status updates.

Next: Run /continue-feature to start implementing.
```
