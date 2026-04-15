# Project Folder Structure

## Root

```
2026_react_with_claude/
├── public/               # Static assets served as-is
├── src/                  # Application source code
├── rules/                # Project guidelines and conventions
├── db.json               # JSON Server mock REST API data
├── index.html            # Vite HTML entry point
├── vite.config.ts        # Vite + path alias config
├── tsconfig*.json        # TypeScript configs (app, node, base)
├── eslint.config.js      # ESLint flat config
├── package.json
├── CLAUDE.md             # Claude Code instructions
└── PRODUCT_CATALOG_DASHBOARD_PRD.md
```

## `src/` Structure

```
src/
├── main.tsx              # App entry — mounts React, wraps with providers
├── App.tsx               # Root component — renders router outlet
│
├── assets/               # Static images/SVGs imported by components
│
├── components/           # Shared, reusable UI components (not feature-specific)
│   └── layout/           # App shell components
│       ├── AppLayout.tsx # Persistent layout wrapper (Header + Footer + Outlet)
│       ├── Header.tsx
│       └── Footer.tsx
│
├── features/             # Feature-sliced modules (one folder per domain/page)
│   ├── admin/
│   │   ├── api/          # TanStack Query mutation hooks for admin CRUD
│   │   │   ├── useCreateProduct.ts
│   │   │   ├── useUpdateProduct.ts
│   │   │   └── useDeleteProduct.ts
│   │   ├── components/   # Page and UI components scoped to admin
│   │   │   └── AdminPage.tsx
│   │   └── index.ts      # Public API — re-exports for use outside the feature
│   │
│   ├── dashboard/
│   │   ├── api/          # TanStack Query query hooks for dashboard data
│   │   │   ├── useLowStockProducts.ts
│   │   │   └── useRecentProducts.ts
│   │   ├── components/
│   │   │   └── DashboardPage.tsx
│   │   └── index.ts
│   │
│   └── products/         # Shared product domain (queries, schema, keys)
│       ├── api/
│       │   ├── keys.ts           # Query key factory for products
│       │   ├── useProducts.ts    # Fetch all products
│       │   └── useProduct.ts     # Fetch single product by id
│       ├── schemas/
│       │   └── product.schema.ts # Zod schema + inferred TypeScript types
│       └── index.ts
│
├── lib/                  # Third-party client configuration (singletons)
│   ├── axios.ts          # Axios instance with baseURL
│   ├── queryClient.ts    # TanStack Query client instance
│   └── theme.ts          # MUI theme definition
│
├── providers/            # React context / provider tree
│   ├── AppProviders.tsx        # Composes all providers in one place
│   ├── QueryProvider.tsx       # TanStack Query provider
│   └── ErrorBoundaryProvider.tsx
│
├── router/
│   └── index.tsx         # React Router v7 declarative route config
│
└── stores/
    └── uiStore.ts        # Zustand store for UI state (drawers, filters, etc.)
```

## Conventions

### Features (`src/features/`)

- Each page or domain area gets its own feature folder.
- Subfolders within a feature: `api/`, `components/`, `schemas/`, `hooks/` (as needed).
- `index.ts` is the public boundary — other features and the router import only from `features/<name>/index.ts`, never from deep paths inside another feature.
- Query hooks (`use*.ts`) live in `api/`; they import query keys from `keys.ts` in the same folder.

### Shared components (`src/components/`)

- Only truly reusable, feature-agnostic components go here.
- Grouped by concern (e.g., `layout/`). Add more sub-folders as the app grows.

### Library singletons (`src/lib/`)

- One file per third-party client. No business logic here — just configuration and export of the configured instance.

### Stores (`src/stores/`)

- One Zustand store file per concern. Stores hold **UI state only** (open/close, selected IDs, active filters). Server state lives in TanStack Query.

### Providers (`src/providers/`)

- `AppProviders.tsx` composes all providers so `main.tsx` stays clean.
- Add a new `*Provider.tsx` file here when introducing a new context.

### Schemas (`features/<name>/schemas/`)

- Zod schemas define the shape and validation rules for domain objects.
- Export both the Zod schema and the inferred TypeScript type from the same file.

### Path Aliases

TypeScript path aliases (configured in `tsconfig.app.json` and resolved by `vite-tsconfig-paths`) are preferred over deep relative imports. Use aliases any time you cross a top-level `src/` boundary.
