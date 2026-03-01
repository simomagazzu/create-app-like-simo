---
description: Review a pull request with security and quality checks
---

# Review PR

Pull request(s): $ARGUMENTS

If no PR numbers provided, ask the user.

## Steps

### 1. Retrieve PR Details

```bash
gh pr view {number} --json title,body,files,additions,deletions,commits,author
gh pr diff {number}
```

### 2. Assess Complexity

- **Simple** (≤5 files, ≤100 lines): review directly
- **Medium** (6-15 files or 100-500 lines): spawn 1-2 subagents for focused areas
- **Complex** (>15 files or >500 lines): spawn up to 3 subagents

### 3. Security Checklist

For every PR, verify:

- [ ] **Auth checks**: All new API routes use `requireApiAuth()` if they should be protected
- [ ] **Rate limiting**: All new API routes call `applyRateLimit()`
- [ ] **Input validation**: All request bodies validated with `parseBody()` + Zod schema
- [ ] **No hardcoded secrets**: No API keys, passwords, or tokens in code
- [ ] **SQL safety**: No raw SQL queries — all queries use Drizzle ORM
- [ ] **File upload safety**: Any uploads use the `storage.ts` abstraction with validation
- [ ] **Error handling**: Errors don't leak internal details to the client
- [ ] **CSRF**: State-changing operations require POST/PUT/DELETE, not GET

### 4. Quality Checklist

- [ ] **Types**: No `any` types unless unavoidable (and commented why)
- [ ] **Imports**: Using `@/` alias, not relative paths crossing boundaries
- [ ] **Components**: Using shadcn/ui where possible
- [ ] **Dark mode**: New UI supports both themes
- [ ] **Error states**: UI handles loading, error, and empty states
- [ ] **Console**: No `console.log` — use `logger` from `@/lib/logger`

### 5. Vision Alignment

Read `CLAUDE.md` and the project's README. Does this PR align with what the app is supposed to do?

### 6. Output

```
## PR #{number}: {title}

### Security: {✅ Pass / ⚠️ Issues Found}
{List any security issues with severity: 🔴 Critical / 🟡 Warning / 🔵 Info}

### Quality: {✅ Good / ⚠️ Suggestions}
{List any quality issues}

### Summary
{Overall assessment — safe to merge? What needs attention?}

### Suggested Improvements
{Ordered by impact, with difficulty estimate}
```
