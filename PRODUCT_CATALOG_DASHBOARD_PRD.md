# 📘 Product Requirements Document (PRD)

## Product Catalog Dashboard (Demo App)

---

## 1. 🧭 Overview

The **Product Catalog Dashboard** is a frontend demo application designed to showcase modern React ecosystem tools. It provides a simple interface to **view product insights** and **manage catalog data** through an admin panel.

The application uses a **local JSON server** as a mock backend and focuses on demonstrating best practices in state management, data fetching, forms, and UI components.

---

## 2. 🎯 Objectives

- Demonstrate integration of key React libraries in a real-world scenario
- Provide a clean, minimal 2-page application
- Showcase data grid capabilities with inline management
- Highlight form validation and API interaction patterns
- Serve as a portfolio/demo-ready project

---

## 3. 👤 Target Users

- Developers evaluating React ecosystem tools
- Hiring managers reviewing frontend skills
- Learners exploring modern React architecture

---

## 4. 📄 Pages & Functionality

### 4.1 Landing Page (Dashboard)

**Purpose:**
Provide a high-level overview of the product catalog.

**Key Elements:**

- Total product count
- Category distribution summary
- Low stock indicators
- Recently added products

---

### 4.2 Admin Page (Catalog Management)

**Purpose:**
Enable full management of product records.

**Key Elements:**

- Data grid displaying product list
- Add new product via drawer form
- Edit product via drawer form
- Delete product
- Sorting and filtering capabilities

---

## 5. ⚙️ Core Features

- Fetch product data from local JSON server
- Create, update, and delete product records
- Form validation using schema-based approach
- Drawer-based UX for add/edit actions
- Optimistic UI updates for smoother interaction
- Global UI state management (e.g., drawer state, filters)
- Loading and error state handling
- Responsive layout

---

## 6. 🧱 Non-Functional Requirements

- Fast development and build performance
- Clean and modular code structure
- Maintainable and scalable architecture
- Basic test coverage (unit + E2E)
- Good user experience with minimal latency

---

## 7. 🧰 Tech Stack

- React 19
- Vite
- React Router
- TanStack Query with Axios
- Zustand
- React Hook Form
- Zod
- Material UI
- AG Grid React
- Vitest + React Testing Library
- Playwright

---

## 8. 🔌 Data Source

- Local JSON server
- REST-style endpoints (e.g., `/products`)
- Simulated network delays (optional for realism)

---

## 9. 🧪 Testing Strategy

**Unit Testing:**

- Component rendering
- Form validation logic
- Store behavior
- Data fetching hooks (mocked)

**End-to-End Testing:**

- View dashboard data
- Add new product
- Edit existing product
- Delete product
- Validate form errors

---

## 10. 🚀 Future Enhancements (Optional)

- Role-based access (admin/viewer)
- Search with debounce
- Bulk actions in grid
- Export data functionality
- Theming (dark/light mode)

---

## 11. ✅ Success Criteria

- Application runs locally with minimal setup
- All core CRUD operations work correctly
- UI is responsive and intuitive
- Demonstrates effective use of all listed libraries
- Includes working unit and E2E tests

---
