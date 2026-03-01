---
description: Continue implementing the next task for a feature
---

# Continue Feature

Finds and implements the next available task. Works with GitHub (if published) or offline from the implementation plan.

## Step 1: Locate the Feature

Look for the feature folder in `/specs/{feature-name}/`. It should contain:
- `requirements.md`
- `implementation-plan.md`
- `github.md` (if published to GitHub)

If no folder is attached, ask the user to specify which feature.

## Step 2: Load Context Efficiently

**Read these files first (always):**
1. `CLAUDE.md` — project conventions
2. `src/lib/schema.ts` — current database schema
3. The feature's `requirements.md` — what we're building
4. The feature's `implementation-plan.md` — what's next

**Then load task-specific files** from the `### Files to Read` section of the current phase. This prevents wasting context on irrelevant code.

**Never load**: `node_modules/`, `.next/`, `pnpm-lock.yaml`, `drizzle/meta/`

## Step 3: Find the Next Task

### If `github.md` exists (GitHub mode):

1. **Read cached references** from `github.md` frontmatter:
   - `feature_name`, `epic_issue`, `repository`, `owner`
   - `project_number`, `project_id`, `status_field_id`, `in_progress_option_id`, `done_option_id`

2. **Query open issues**:
   ```bash
   gh issue list --label "feature/{feature_name}" --state open --json number,title,body,labels --limit 100
   ```

3. **Select next work**:
   - Skip the Epic issue (has `epic` label)
   - Find the lowest-numbered open phase issue
   - Within that phase, find the first unchecked task `- [ ]`
   - If all tasks checked → close the phase issue, move to next phase

### If no `github.md` (offline mode):

1. Read `implementation-plan.md`
2. Find the first unchecked task `- [ ]`
3. Track progress directly in the markdown file

### If everything is done:
```
🎉 All tasks for {feature_name} are complete!
```

## Step 4: Display Task Info

```
📋 Next Task: {task description}
   Phase: {N} — {phase title}
   Progress: {completed}/{total} tasks ({percentage}%)
   
   Proceeding with implementation...
```

## Step 5: Update Status (GitHub mode only)

If `github.md` has cached project IDs, use them directly. If not, query once and **cache them in `github.md` frontmatter** for future runs:

```bash
# Comment on the issue
gh issue comment {issue-number} --repo {repository} --body "🚀 Implementation started"

# Update project board status to "In Progress"
gh project item-edit \
  --project-id {project_id} \
  --id {item_id} \
  --field-id {status_field_id} \
  --single-select-option-id {in_progress_option_id}
```

**Caching**: After first discovery of project IDs, add them to `github.md`:
```yaml
project_id: "PVT_..."
status_field_id: "PVTSSF_..."
in_progress_option_id: "47fc..."
done_option_id: "9823..."
```
This eliminates 3-4 API calls on every subsequent run.

## Step 6: Implement

Follow project conventions from CLAUDE.md:
- Use `@/` import alias
- Use existing API utilities (`apiResponse`, `requireApiAuth`, `applyRateLimit`, `parseBody`)
- Every API route gets rate limiting + auth + validation
- Use shadcn/ui components for UI
- Support dark mode

## Step 7: Validate

```bash
pnpm lint && pnpm typecheck
```

**If errors occur**: attempt to fix automatically (up to 2 retries). Only ask the user if auto-fix fails.

## Step 8: Commit

```bash
git add .
git commit -m "feat: {concise task description}"
```

For complex task issues: `git commit -m "feat: {description} closes #{issue-number}"`

## Step 9: Update Tracking

### GitHub mode:
- Check off the task in the phase issue body
- Add implementation details as a comment:
  ```
  ✅ **Task complete**
  
  **Files changed**: {list}
  **Summary**: {what was done}
  
  Lint: ✅ | TypeCheck: ✅
  Commit: {hash}
  ```
- If phase complete: update project status to "Done", close the phase issue

### Offline mode:
- Check off the task in `implementation-plan.md`: `- [ ]` → `- [x]`

## Step 10: Report

```
✅ Task complete: {description}

Phase {N}/{total}: {phase title}
Progress: {completed}/{total} tasks ({percentage}%)

Files changed:
  - {file list}

Next: Run /continue-feature for the next task, or review changes first.
```

## Edge Cases

### Branch is behind main
```bash
git fetch origin main
git log HEAD..origin/main --oneline
```
If behind, warn: "Your branch is {N} commits behind main. Consider rebasing first."

### Lint/typecheck fails after 2 retries
```
⚠️ Auto-fix failed. Errors:
{error output}

Please fix manually or provide guidance.
```

### Phase complete
Close the phase issue, report progress, and automatically continue to the next phase.
