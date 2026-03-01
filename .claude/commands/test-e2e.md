# /test-e2e — Run E2E Tests

Run Playwright end-to-end tests on demand. Tests live in `e2e/`.

## Prerequisites check

Before running, verify:
1. The dev server is running at `http://localhost:3000` (or `reuseExistingServer` will start one)
2. The database is running (`docker compose up -d`)
3. Migrations are applied (`pnpm run db:migrate`)

## Steps

### 1. Run the test suite

```bash
pnpm test:e2e
```

### 2. Interpret results

- **All green** → tests pass, summarise what was tested
- **Failures** → read the error output carefully and identify the root cause:
  - If a selector is wrong (element not found), read the relevant page component and fix the selector
  - If a redirect URL is wrong, check `src/lib/session.ts` for the redirect target
  - If a test assumption is wrong (e.g. expected text changed), update the test to match current behaviour
  - Never delete a test to make it pass — fix the underlying issue or the test logic

### 3. After fixing failures

Re-run to confirm:

```bash
pnpm test:e2e
```

Then run the standard checks:

```bash
pnpm lint && pnpm typecheck
```

## Context to load

- `playwright.config.ts` — test config (baseURL, webServer, reporters)
- `e2e/` — all test files
- Relevant page/component files if a test is failing and you need to debug selectors

## Adding tests for a new feature

When asked to write tests for a feature, create a new file in `e2e/`:

```
e2e/
  auth.spec.ts        ← starter auth tests
  <feature>.spec.ts   ← one file per feature area
```

Each test file should:
- Group tests with `test.describe()`
- Cover the happy path + at least one error state
- Use `getByRole` / `getByLabel` / `getByPlaceholder` over CSS selectors
- Use unique data (e.g. `Date.now()` in emails) so tests can be re-run without DB resets

## Useful flags

```bash
pnpm test:e2e:ui       # Open the Playwright interactive UI (great for debugging)
pnpm test:e2e:headed   # Watch the browser while tests run
pnpm test:e2e -- --grep "auth"   # Run only tests matching "auth"
pnpm exec playwright show-report  # Open the last HTML report
```
