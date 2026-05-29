# User Guide — CRM/Admin Portal Playwright Framework

This guide is intended for QA engineers, automation developers, and reviewers who need to use, maintain, or extend the finished framework.

## 1. Purpose of the project

This repository combines a polished demo CRM/Admin web application with a production-like Playwright automation framework.
It is designed to demonstrate:

- realistic enterprise workflows
- deterministic local execution
- consistent role-based access testing
- reusable automation architecture with page objects, service clients, and fixtures
- clear separation of UI and API validation

## 2. Prerequisites

Required:

- Node.js 18 or newer
- npm

Optional but helpful:

- Git
- VS Code or similar editor

## 3. Setup

From the project root run:

```bash
npm install
npx playwright install
```

This installs dependencies and Playwright browser binaries.

## 4. Application structure

### Core paths

- `src/server.js` — local Express server, authentication, customer API, audit logging, and settings.
- `src/public/` — UI pages for login, dashboard, customers, audit, admin, and customer detail.
- `src/public/assets/` — shared CSS and client-side JS used by the pages.
- `src/test-support/` — reusable automation helpers.
- `tests/api/` — API-focused validation specs.
- `tests/ui/` — browser-based end-to-end specs.

### Test-support structure

- `fixtures.ts` — authenticated role fixtures and page/session helpers.
- `pages/` — page objects for login, dashboard, and customer management.
- `services/` — API client, auth strategy, and JSON schema helpers.
- `factories/` — data builder utilities for customer payloads.
- `utils/` — logging and schema validation.

## 5. Running the demo app

You can run the demo app manually:

```bash
npm start
```

Then browse:

```bash
http://localhost:3000
```

The app includes:

- polished login experience
- dashboard KPI summary
- customer management with search, filter, sort, and pagination
- customer detail pages
- admin settings and audit log pages
- role-based access enforcement

## 6. Running tests

### Full test suite

```bash
npm test
```

### UI tests only

```bash
npm run test:ui
```

### API tests only

```bash
npm run test:api
```

### Lint and type-check

```bash
npm run lint
npm run typecheck
```

### Format the repository

```bash
npm run format
```

## 7. How the test framework works

The framework runs against the local demo server defined in `src/server.js`.
Playwright starts the server automatically via `playwright.config.ts`.
This keeps CI and local executions consistent.

Key design points:

- `data-testid` attributes are used for stable selectors.
- Page objects encapsulate UI flows.
- Shared fixtures provide authenticated API and browser contexts.
- API tests are isolated from browser state.
- UI tests verify end-to-end navigation and interactions.

## 8. Personas and credentials

The project defines two personas:

- Admin: `admin@example.com` / `Admin123!`
- Viewer: `viewer@example.com` / `Viewer123!`

Admin users can manage customers, view audit logs, and update admin settings.
Viewer users can browse data but are blocked from admin actions.

## 9. Common commands

Run a single spec:

```bash
npx playwright test tests/ui/dashboard.spec.ts --project=chromium
```

Run one API file:

```bash
npx playwright test tests/api/auth.spec.ts --project=chromium
```

Open the last HTML report:

```bash
npx playwright show-report
```

## 10. Writing new tests

### UI tests

1. Add page object methods in `src/test-support/pages/`.
2. Create a test file under `tests/ui/`.
3. Use fixtures from `src/test-support/fixtures.ts`.
4. Prefer `data-testid` selectors.
5. Keep each spec focused on a single workflow.

### API tests

1. Reuse `ApiClient` in `src/test-support/services/ApiClient.ts`.
2. Authenticate via `AuthService` when needed.
3. Assert response status codes and payload shapes.
4. Keep API tests deterministic.

## 11. Extending the framework

When adding new automation capabilities:

- add reusable helpers in `src/test-support/utils/`
- add data builders in `src/test-support/factories/`
- keep test logic in `tests/` files only
- add or update `data-testid` attributes for stable selectors
- update documentation and guides alongside code changes

## 12. Troubleshooting

- If a selector fails, verify the page includes the `data-testid` attribute.
- If a login flow stops working, verify the correct credentials are used.
- If tests fail in CI but pass locally, ensure the server starts correctly and the browser binaries are installed.
- If TypeScript issues arise, run:

```bash
npm run typecheck
```

## 13. Best practices

- Reuse page objects and fixtures rather than duplicating selectors.
- Keep automation suites small and focused.
- Validate both success and failure scenarios.
- Maintain separation between UI flows and backend checks.

## 14. Notes for reviewers

The completed repo now demonstrates:

- a modern CRM/admin web app with enterprise-style workflows
- a scalable Playwright automation architecture
- strong role-based access coverage
- deterministic data flows for robust testing
- polished documentation for contributors

---

This user guide is designed to make onboarding and maintenance straightforward while preserving the finished project state.
