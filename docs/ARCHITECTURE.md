# Architecture Overview

This document summarizes the architecture and design decisions for the CRM/Admin Portal Playwright framework portfolio project.

Folders

- `src/` — local Express demo server and static UI pages used for deterministic tests.
- `tests/pages/` — Page Object Model classes representing UI pages and components.
- `tests/ui/` — UI E2E tests. Each file represents a single business flow.
- `tests/api/` — API-level tests validating backend endpoints.
- `tests/fixtures.ts` — Playwright test fixtures (authenticated session reuse).
- `tests/utils/` — helper utilities (e.g., `auth.ts` for API login flows).
- `tests/data/` — test data factories for deterministic, unique test inputs.

Key patterns

- Page Object Model: encapsulates selectors and actions in `tests/pages/` to keep tests expressive and maintainable.
- API-first auth: tests use API login and store tokens in `localStorage` to speed up UI tests and keep them isolated.
- One business flow per test file: tests mirror real client flows and avoid duplicated logic.
- Deterministic demo server: an in-memory Express server is included to ensure stable test runs without external dependencies.

CI

- The Playwright `webServer` will start the demo server automatically during CI runs.
- The GitHub Actions workflow installs browsers and runs type-check and Playwright tests. Test artifacts are uploaded from `playwright-report/`.

Extending the framework

- Add more POM classes under `tests/pages/` for new screens.
- Add richer fixtures to `tests/fixtures.ts` for role-based sessions.
- Add API client classes under `tests/services/` for advanced cross-layer validation.
