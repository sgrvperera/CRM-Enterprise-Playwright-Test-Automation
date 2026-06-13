# CRM/Admin Portal Playwright Framework

A polished automation portfolio framework built around a deterministic CRM/Admin demo app.
This repo is designed to show clients a production-style Playwright setup with strong reporting, professional CI, and reusable test architecture.

## What this framework does

This project automates a local CRM/Admin portal with end-to-end UI and API validation.
The framework covers authentication, role-based access, customer management, audit events, and admin controls while generating debug-ready artifacts for every CI run.

## Key features

- deterministic local Express demo server
- browser tests with Playwright and Page Object Model
- API validation with reusable service client abstractions
- stable selectors via `data-testid`
- failure artifacts: screenshots, videos, traces, HTML report
- CI-friendly reporting and artifact upload
- built-in credentials for Admin and Viewer personas

## Tech stack

- Node.js 18+
- Express.js demo backend
- Playwright Test for browser automation
- TypeScript for test support and configuration
- ESLint + Prettier for code quality

## Project structure

- `src/server.js` — demo backend, auth, customer API and admin endpoints
- `src/public/` — static app pages and asset scripts
- `src/test-support/` — fixtures, page objects, API clients, and helpers
- `tests/ui/` — browser-driven end-to-end specs
- `tests/api/` — service-layer API validation specs
- `.github/workflows/ci.yml` — CI pipeline definition
- `playwright.config.ts` — Playwright test configuration and artifact settings

## Setup

Install dependencies and Playwright browsers:

```bash
npm install
npx playwright install
```

No additional environment variables are required for the demo app.

### Built-in test data

- Admin user: `admin@example.com` / `Admin123!`
- Viewer user: `viewer@example.com` / `Viewer123!`

## Running tests locally

Run the full suite:

```bash
npm test
```

Run the browser UI suite only:

```bash
npm run test:ui
```

Run the API tests only:

```bash
npm run test:api
```

Run the CI-friendly suite:

```bash
npm run test:ci
```

## Running a specific test

Run a single UI spec:

```bash
npx playwright test tests/ui/login.spec.ts --project=chromium
```

Run a specific API file:

```bash
npx playwright test tests/api/auth.spec.ts
```

## Reporting and debugging

This project produces:

- HTML report: `playwright-report/`
- test artifacts: `test-results/`
- screenshots on failure
- video recording on failure
- trace files on failure
- JUnit XML output at `test-results/junit.xml`

View the HTML report locally:

```bash
npm run report
```

## CI/CD

The GitHub Actions workflow:

- checks out the repository
- installs Node dependencies
- installs Playwright browser dependencies
- runs lint and TypeScript validation
- executes the Playwright test suite
- uploads `playwright-report` and `test-results` as build artifacts

This makes test failures easy to inspect from the CI run.

## Best practices implemented

- Page Object Model for UI interaction reuse
- shared authenticated fixtures for browser and API flows
- deterministic local server for consistent CI runs
- explicit failure-only artifacts for debugging
- clear separation of UI and API tests
- stable selectors with `data-testid`
- professional CI artifact collection

## Known limitations

- no coverage collection is configured yet
- the demo app is self-contained and not backed by an external database
- browser tests currently run against Chromium only

## Future enhancements

- add coverage reporting with `c8` or `nyc`
- support parallel browser projects across Chrome, Firefox, and WebKit
- add data-driven test parameterization for more scenarios
- introduce API contract validation with OpenAPI or JSON schema
- add page-level visual regression checks

## Commands reference

- `npm install` — install dependencies
- `npx playwright install` — install browser binaries
- `npm test` — run all Playwright specs
- `npm run test:ci` — run CI-friendly suite
- `npm run test:ui` — run UI-only specs
- `npm run test:api` — run API-only specs
- `npm run report` — open the HTML report
- `npm run lint` — lint files
- `npm run typecheck` — run TypeScript checks
- `npm run format` — format the repository

## Credentials

- Admin: `admin@example.com` / `Admin123!`
- Viewer: `viewer@example.com` / `Viewer123!`

## Portfolio Demo Update


