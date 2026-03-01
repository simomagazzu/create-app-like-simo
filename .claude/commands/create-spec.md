---
description: Interview the user about what they want to build, then create a detailed spec
---

# Create Spec

This command has two phases: **interview** and **generate**.

## Phase 1: Interview

Before creating any files, have a focused conversation to understand what the user wants to build. Ask questions in this order — adapt based on answers, skip what's already clear.

### Core Questions

1. **What does the app do?** (one sentence)
2. **Who uses it?** (target users, roles if multi-role)
3. **What are the 3-5 most important things a user can do?** (core features)
4. **What data does the app store?** (think about the database tables needed)
5. **Does it need AI?** If yes: what should the AI do specifically?
6. **Any third-party integrations?** (payments, email, external APIs)

### Follow-Up Questions (ask only if relevant)

- Are there different user roles with different permissions?
- Does it need real-time features (live updates, notifications)?
- Is there file uploading involved?
- Are there any specific pages or screens you have in mind?
- What does success look like — what's the MVP vs nice-to-have?

### Interview Rules

- Ask 2-3 questions at a time, not all at once
- Summarize what you've understood after each round
- Push for specifics: "a dashboard" → "what's on the dashboard?"
- Once you have enough detail, confirm by presenting a summary:

```
Here's what I understand you want to build:

**App**: [one-liner]
**Users**: [who]
**Core features**:
1. [feature]
2. [feature]
3. [feature]

**Data model**: [key entities]
**AI usage**: [yes/no + what]
**Integrations**: [list]

Does this capture it? Anything to add or change?
```

Only proceed to Phase 2 after the user confirms.

## Phase 2: Generate Spec

### 1. Create the feature folder

Path: `specs/{feature-name}/` (kebab-case)

### 2. Create `requirements.md`

```markdown
# {Feature Name}

## Summary
{One paragraph describing the app/feature}

## Users
{Who uses this and their roles}

## Core Features
1. **{Feature}** — {description}
2. **{Feature}** — {description}
...

## Data Model
{Describe the key entities, their relationships, and important fields}

## AI Integration
{How AI is used, or "None" if not applicable}

## Acceptance Criteria
- [ ] {Criterion 1}
- [ ] {Criterion 2}
...
```

### 3. Create `implementation-plan.md`

```markdown
# Implementation Plan: {Feature Name}

## Overview
{Brief summary of the build approach}

## Phase 1: {Phase Name} [S/M/L]

{What this phase accomplishes}

### Tasks
- [ ] Task description
- [ ] Task description (depends on previous)
- [ ] Task description [complex]

### Technical Details
{CLI commands, schemas, code patterns, file paths — everything an agent needs to implement this phase without asking questions}

### Files to Read
{List the specific files from the codebase that are relevant to this phase — this feeds into context management}

## Phase 2: {Phase Name} [S/M/L] (blocked by: Phase 1)
...
```

**Size labels**: S = single file change, M = 2-5 files, L = 6+ files or architectural

### 4. Create `action-required.md`

```markdown
# Action Required: {Feature Name}

Manual steps that need a human. Cannot be automated.

## Before Implementation
- [ ] **{Action}** — {why}

## During Implementation
- [ ] **{Action}** — {why}

## After Implementation
- [ ] **{Action}** — {why}
```

If no manual steps: write "No manual steps required."

### 5. Create `decisions.md`

```markdown
# Architecture Decisions: {Feature Name}

Decisions made during planning. Reference these if questions come up during implementation.

## {Decision Title}
**Context**: {Why this decision came up}
**Decision**: {What was decided}
**Alternatives considered**: {What else was considered and why it was rejected}
```

## Rules

- Tasks must be atomic — implementable in one session by an agent
- Mark complex tasks with `[complex]` — these get their own GitHub issue
- The `### Technical Details` section is the **single source of truth**. If it wasn't captured there, it's lost.
- The `### Files to Read` section enables efficient context loading in `/continue-feature`
- Do NOT include testing tasks unless the user explicitly asks
- Each phase's size label helps estimate effort

## After Creating

Tell the user:

> Spec created at `specs/{feature-name}/`
>
> **Next steps:**
> 1. Review `action-required.md` for manual tasks
> 2. Review the implementation plan
> 3. Run `/publish-to-github` to create GitHub issues and tracking
> 4. Run `/continue-feature` to start building
