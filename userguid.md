# User Guide: CRM/Admin Portal Playwright Framework

This user guide explains how to use the current framework from initial setup through execution, debugging, and extension. It is written for QA engineers, automation developers, and technical reviewers.

## 1. What this project is

A Playwright automation framework built around a local CRM/Admin demo app. The framework is designed to be:

- maintainable
- easy to extend
- separated between test specs and support logic
- role-aware for Admin and Viewer workflows
- ready for CI and reporting

## 2. Prerequisites

Before using the repository, install:

- Node.js 18 or newer
- npm (installed with Node.js)
- Git (optional but recommended)

## 3. Install dependencies

From the project root run:

```bash
npm install
npx playwright install
```

This installs project dependencies and the required Playwright browser binaries.

## 4. Core repository structure

The repository is organized to keep tests clean and support code reusable.

### Root folders

- `src/` — demo application and support utilities
- `tests/` — only the Playwright test specs
- `.github/workflows/` — CI definitions
- `playwright.config.ts` — Playwright runtime configuration

### Key folders inside `src/`

- `src/server.js` — Express-based CRM demo server and API implementation
- `src/public/` — static HTML pages and client-side logic used by the demo app
- `src/test-support/` — shared automation helpers
  - `pages/` — page objects for UI interaction logic
  - `fixtures.ts` — authenticated fixtures and browser session setup
  - `services/` — API client, auth service, schema definitions, and validation
  - `factories/` — reusable test data builders
  - `data/` — simple helper data utilities
  - `utils/` — logging and schema validation helpers

### Key folders inside `tests/`

- `tests/api/` — API validation and contract tests
- `tests/ui/` — UI end-to-end regression tests

## 5. How the demo app works

The demo app is a deterministic CRM/admin portal with:

- login and logout
- dashboard with live customer metrics
- customer management pages
- search and filter support
- admin-only audit and settings pages
- role-based access restrictions
- token-based authentication

The test suite uses the local server created by `src/server.js` and exercises the app through browser automation and API calls.

## 6. Running tests

### Run the full suite

```bash
npm test
```

### Run only UI tests

```bash
npm run test:ui
```

### Run only API tests

```bash
npm run test:api
```

### Run lint and type-check only

```bash
npm run lint
npm run typecheck
```

### Format the code

```bash
npm run format
```

## 7. How the Playwright configuration works

The `playwright.config.ts` file starts the local server automatically during tests using the `webServer` setting. This means:

- you do not need to start the app manually for CI or local test execution
- the demo app is available at `http://localhost:3000`
- tests run against the prepared browser context and stable selector conventions

## 8. Authentication and roles

The framework supports two personas:

- **Admin** — `admin@example.com` / `Admin123!`
- **Viewer** — `viewer@example.com` / `Viewer123!`

The `src/test-support/fixtures.ts` file creates authenticated sessions by logging in through the API and storing the issued token in browser `localStorage`.

Admin and Viewer flows are separated so you can validate both success and forbidden / unauthorized behavior.

## 9. How to run a single spec

To run one UI spec, use:

```bash
npx playwright test tests/ui/dashboard.spec.ts --project=chromium
```

To run one API spec, use:

```bash
npx playwright test tests/api/auth.spec.ts --project=chromium
```

## 10. Adding a new UI test

1. Add missing UI interaction methods to a page object in `src/test-support/pages/`
2. Create a new spec file under `tests/ui/`
3. Import `test` and `expect` from `../../src/test-support/fixtures` when you need authenticated sessions
4. Use `data-testid` selectors in the page object and spec
5. Keep the spec focused on a single business outcome
6. Run the spec locally and confirm it passes

## 11. Adding a new API test

1. Add or reuse an API client method inside `src/test-support/services/ApiClient.ts`
2. If you need authenticated sessions, use `AuthService` from `src/test-support/services/AuthService.ts`
3. Create a new spec under `tests/api/`
4. Assert status codes and response payloads consistently

## 12. Extending fixtures and support logic

The `src/test-support/fixtures.ts` file currently defines:

- `adminApi` — authenticated API client for Admin user
- `viewerApi` — authenticated API client for Viewer user
- `adminPage` — browser page with admin session loaded
- `viewerPage` — browser page with viewer session loaded
- `loggedInPage` — generic logged-in browser page for reusable UI flows

To add new test support:

- add new page objects in `src/test-support/pages/`
- add shared helpers in `src/test-support/utils/`
- add service helpers in `src/test-support/services/`
- keep test-specific logic inside the `tests/` folder only

## 13. How to read reports

After test execution, the HTML report is generated in `playwright-report/`.

Open it with:

```bash
npx playwright show-report
```

## 14. Troubleshooting

- If a test cannot find an element, verify the `data-testid` attribute exists in `src/public/`
- If authentication fails, verify the login credentials and that the web server started automatically
- If formatting issues appear, run `npm run format`
- If TypeScript errors appear, run `npm run typecheck`

## 15. Best practices

- Favor page objects over inline page automation in specs
- Keep support utilities in `src/test-support/`
- Keep specs under `tests/` only
- Use small, readable tests instead of large monolithic flows
- Validate both happy paths and forbidden / error paths

## 16. Recommended workflow

1. install packages: `npm install`
2. install browsers: `npx playwright install`
3. run full validation: `npm test`
4. add or update tests and page objects
5. run targeted specs locally
6. run lint and typecheck
7. commit and push

## 17. Notes for maintainers

- Keep the framework deterministic by relying on the local demo server
- Avoid hard-coded selectors outside page objects
- Keep API schemas aligned with server payloads
- Keep CI and local behavior consistent through the `playwright.config.ts` web server

---

This user guide is written to make the current framework easy to understand and use, even for developers who are new to this codebase.
