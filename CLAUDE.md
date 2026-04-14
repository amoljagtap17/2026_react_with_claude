# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000 (strict port)

# Build & Preview
npm run build        # Type-check then bundle with Vite
npm run preview      # Preview production build at http://localhost:3000

# Linting & Formatting
npm run lint                # Run ESLint on all files
npm run prettier:check      # Check formatting
npm run prettier:write      # Auto-format all files
```

Pre-commit hook runs `lint-staged`, which auto-formats staged files with Prettier.

## Project Purpose

This is a **Product Catalog Dashboard** demo app — a 2-page React application backed by a local JSON server (mock REST API at `/products`). It is not yet fully built; [PRODUCT_CATALOG_DASHBOARD_PRD.md](PRODUCT_CATALOG_DASHBOARD_PRD.md) is the requirements document.

**Pages planned:**

- **Dashboard** — product count, category distribution, low stock indicators, recently added products
- **Admin** — AG Grid data table with CRUD operations via drawer forms

## Architecture & Key Libraries

| Concern                      | Library                                     |
| ---------------------------- | ------------------------------------------- |
| Routing                      | React Router v7                             |
| Server state / data fetching | TanStack Query v5 + Axios                   |
| Client/UI state              | Zustand v5                                  |
| Forms                        | React Hook Form + Zod (schema validation)   |
| UI components                | MUI v9 + `@fontsource/roboto`               |
| Data grid                    | AG Grid React v35                           |
| Error boundaries             | `react-error-boundary`                      |
| Testing (planned)            | Vitest + React Testing Library + Playwright |

**Path aliases** are enabled via `vite-tsconfig-paths` — use TypeScript path aliases for imports rather than relative paths across directories.

**Data layer pattern to follow:** TanStack Query manages all server state (fetching, caching, mutations with optimistic updates). Zustand handles UI state only (e.g., drawer open/close, active filters). Axios is the HTTP client wired into query/mutation functions.

**Form pattern:** React Hook Form + Zod resolver (`@hookform/resolvers/zod`) for all form validation.

## TypeScript Config

Strict settings are on: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. Module resolution is `bundler` mode with `verbatimModuleSyntax` — use `import type` for type-only imports.

## Code Style

Prettier enforces: double quotes, 2-space indent, 80-char print width, LF line endings, trailing commas (ES5), `prettier-plugin-organize-imports` (auto-sorts imports, skips destructive code actions).
