# CRM/Admin Portal Playwright Framework

A polished enterprise-style automation portfolio built around a self-contained CRM/Admin demo application.
This repository demonstrates realistic QA engineering patterns, strong automation architecture, and a modern local web app designed for Playwright validation.

## Project overview

This project combines a deterministic Express-backed demo CRM app with a scalable Playwright automation framework.
It showcases:

- modern UI design for login, dashboard, customers, audit, and admin settings
- robust role-based access control for Admin and Viewer personas
- enterprise test automation patterns with Page Object Model and shared fixtures
- reusable API client utilities and contract validation
- CI-ready execution with Playwright reporting and automated server lifecycle

## What changed in this version

- Expanded application UI to support a polished dashboard, customer management workspace, detail pages, audit log, and admin settings.
- Added customer search, filter, sort, pagination, and bulk delete workflows.
- Included realistic business states: Prospect, Active, Pending, Inactive, Blocked.
- Added server endpoints for customer details, bulk delete, and dashboard summary.
- Strengthened the automation framework with page objects, role fixtures, API services, and reusable data builders.
- Updated tests to validate happy paths, negative flows, role permissions, and UI/API consistency.

## Architecture

- `src/server.js` — local Express demo backend with authentication, authorization, customer data, audit logging, and settings.
- `src/public/` — static UI pages with modern styling and JS-driven page behavior.
- `src/public/assets/` — shared CSS and client-side helpers for auth, API fetching, and UI flow.
- `src/test-support/` — automation support layer for fixtures, page objects, API clients, strategies, and utilities.
- `tests/ui/` — end-to-end browser tests covering login, dashboard, customer CRUD, role access, and negative scenarios.
- `tests/api/` — API tests covering authentication, customer lifecycle, role restrictions, and token validation.
- `.github/workflows/ci.yml` — GitHub Actions pipeline for CI validation.

## Demo app features

- secure login/logout with token-based sessions
- dashboard with KPI cards, activity feed, and status indicators
- customer management workspace with search, filter, sort, and pagination
- create/edit/delete customer flows with inline validation
- viewer/admin role separation and forbidden access handling
- audit log events for create/update/delete actions
- admin settings workflow with persistence and success states
- unauthorized handling and session lifecycle guard

## Installation

```bash
npm install
npx playwright install
```

## Running the project

Start the demo server locally:

```bash
npm start
```

Open the app in the browser:

```bash
http://localhost:3000
```

## Running tests

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

### Code quality checks

```bash
npm run lint
npm run typecheck
npm run format
```

## Test strategy

- `tests/api/` validates the service layer independently from the UI.
- `tests/ui/` validates the end-user workflows and permissions in the browser.
- Shared fixtures and API clients in `src/test-support/` reduce duplication.
- Stable `data-testid` selectors are used throughout the UI pages.
- Role-based flows are covered for both Admin and Viewer personas.
- Negative test coverage includes invalid login, forbidden access, and token tampering.

## Key commands

- `npm install` — install dependencies
- `npx playwright install` — install browser binaries
- `npm test` — run all Playwright specs
- `npm run test:ui` — run UI-only specs
- `npm run test:api` — run API-only specs
- `npm run lint` — lint source files
- `npm run typecheck` — run TypeScript checks
- `npm run format` — format the codebase

## Credentials

- Admin: `admin@example.com` / `Admin123!`
- Viewer: `viewer@example.com` / `Viewer123!`

## CI pipeline

The GitHub Actions workflow performs:

1. checkout repo
2. install Node dependencies
3. install Playwright browsers
4. run lint and typecheck
5. execute the Playwright suite
6. upload HTML reports and test artifacts

## Maintenance notes

- Keep automation logic inside `src/test-support/`.
- Keep test specs under `tests/api/` and `tests/ui/` only.
- Keep UI selectors stable by using `data-testid` attributes.
- Keep page objects small and reusable.
- Avoid business logic inside spec files.

## Why this is portfolio-worthy

- Demonstrates a real QA architecture with separation of concerns.
- Shows both UI and API validation from a single codebase.
- Includes enterprise-style workflows, role-based access, and audit validation.
- Uses modern Playwright patterns with fixtures, page objects, and service wrappers.
- Designed for deterministic local execution and CI reliability.

---

> This README reflects the completed, polished repo state after implementing enterprise-style app and automation improvements.


