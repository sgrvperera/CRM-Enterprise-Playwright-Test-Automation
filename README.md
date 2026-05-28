# CRM/Admin Portal Playwright Framework (Portfolio)

This repository contains a professional, enterprise-style Playwright Test framework for a CRM / Admin Portal demo application. It includes a small deterministic local demo server, UI pages, a Playwright test suite (UI + API), configuration for CI, and developer tooling.

Features

- Local Express demo server with auth and customers CRUD endpoints
- UI pages for login, dashboard and customer management with stable data-testid selectors
- Playwright Test suite (UI and API) organized into smoke/regression-style specs
- Page object patterns, fixtures, API-driven tests, and cross-layer validations
- Playwright `webServer` config to start the demo server during tests

Quickstart

1. Install dependencies:

```bash
npm install
npx playwright install
```

2. Run tests (UI + API):

```bash
npm test
```

Project structure

- `src/` - demo server and static UI pages
- `tests/ui` - UI end-to-end tests (one business flow per file)
- `tests/api` - API level tests for auth and CRUD
- `playwright.config.ts` - Playwright configuration with `webServer` to start the demo app
- `.env.example` - environment variables template

Notes for reviewers

- This project is designed as a portfolio asset showcasing senior QA automation architecture and cross-layer testing patterns. The demo server is intentionally small and deterministic so tests are repeatable.

Badges & CI

- CI: ![CI](https://img.shields.io/badge/ci-pending-lightgrey) (replace with your GitHub Actions CI badge)
- Playwright HTML report: available as an artifact from CI runs.

Coverage & Quality

- ESLint is configured with stricter rules (see `.eslintrc.json`). Run `npm run lint` to check.
- TypeScript type-checking is run via `npm run typecheck`.

Additional tests

- Role-based access tests are included under `tests/api/roles.spec.ts` to validate RBAC (viewer vs admin).
- Data-driven UI tests are included under `tests/ui/data-driven.spec.ts`.


