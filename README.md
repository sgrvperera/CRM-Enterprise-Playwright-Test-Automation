# CRM/Admin Portal Playwright Framework

This repository is a professional Playwright automation framework built around a local CRM/Admin portal demo app. It is designed to demonstrate maintainable, production-ready QA automation practices with clear separation between tests and support code, robust role-based coverage, and CI-ready execution.

## What this repository contains

- `src/server.js` — deterministic Express server for the CRM demo backend
- `src/public/` — static UI pages for login, dashboard, customers, audit, and admin settings
- `src/test-support/` — reusable automation support files, including page objects, fixtures, API clients, and helpers
- `tests/api/` — API contract and CRUD validation tests
- `tests/ui/` — end-to-end UI regression tests
- `.github/workflows/ci.yml` — GitHub Actions pipeline for linting, type checking, and tests

## Why this is professional

- Clean separation: only spec files live under `tests/`
- Support code is centralized under `src/test-support/`
- Page Object Model for browser interactions
- API client abstraction for service-layer validation
- Role-based authentication and authorization coverage
- Contract-aware API validation using schema checks
- CI integration with Playwright reporting and artifact collection

## Demo application capabilities

The CRM demo app supports:

- user login/logout with token-based authorization
- dashboard metrics and page navigation
- customer search, creation, edit, and deletion
- viewer/admin role separation
- admin-only audit log and settings pages
- token validation and session lifecycle handling

## Current repository structure

- `src/`
  - `server.js` — application server and API layer
  - `public/` — UI pages and client-side logic
  - `test-support/` — automation helpers and test utilities
    - `fixtures.ts` — authenticated Playwright fixtures
    - `pages/` — reusable page object models
    - `services/` — API client, auth service, and schemas
    - `factories/` — test data builder utilities
    - `data/` — simple test data helpers
    - `utils/` — validation and logging helpers
- `tests/`
  - `api/` — API validation specs
  - `ui/` — end-to-end UI specs
- `playwright.config.ts` — Playwright project configuration and web server setup
- `package.json` — scripts and dependencies
- `.github/workflows/ci.yml` — CI automation

## Getting started

### 1. Install dependencies

```bash
npm install
npx playwright install
```

### 2. Run the full suite

```bash
npm test
```

### 3. Run UI tests only

```bash
npm run test:ui
```

### 4. Run API tests only

```bash
npm run test:api
```

### 5. Run lint and type-check

```bash
npm run lint
npm run typecheck
```

### 6. Format the codebase

```bash
npm run format
```

## Key commands

- `npm test` — run all Playwright specs
- `npm run test:ui` — run UI-only specs
- `npm run test:api` — run API-only specs
- `npm run lint` — validate JavaScript/TypeScript quality
- `npm run typecheck` — run TypeScript compiler checks
- `npm run format` — apply Prettier formatting

## Test design principles

- **Single-purpose specs**: each test file focuses on one business flow
- **Reusable support code**: page objects and fixtures live in `src/test-support/`
- **Stable selectors**: UI pages use `data-testid` attributes
- **Role-based coverage**: validates both admin and viewer access boundaries
- **API + UI validation**: supports cross-layer consistency checks
- **Data-driven testing**: repeatable scenarios with deterministic payloads

## Supported user personas

- Admin: `admin@example.com` / `Admin123!`
- Viewer: `viewer@example.com` / `Viewer123!`

## CI pipeline

The GitHub Actions workflow automatically:

- installs dependencies and Playwright browsers
- runs `npm run lint` and `npm run typecheck`
- executes the full Playwright suite
- uploads `playwright-report/` and `test-results/` artifacts

## Maintenance guidance

- Keep page objects in `src/test-support/pages/`
- Keep shared helpers and services in `src/test-support/`
- Keep test files under `tests/api/` and `tests/ui/` only
- Use `data-testid` for selectors, not fragile CSS paths
- Keep business logic out of spec files
- Re-run `npm test` after any support refactor

---

> This README is intended to provide a clear, professional overview for contributors and stakeholders, while preserving the current framework implementation and test stability.


