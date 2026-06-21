# VaultIQ

> Premium expense tracking with real-time analytics, 3D visualizations, and intelligent budgeting.

![Next.js](https://img.shields.io/badge/Next.js-16.2.9-000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?logo=tailwindcss)
![Three.js](https://img.shields.io/badge/Three.js-000?logo=three.js)
**Website:** [https://vaultiq-eight.vercel.app](https://vaultiq-eight.vercel.app)

---

## Overview

VaultIQ is a production-grade personal finance dashboard built with Next.js 16 and Supabase. It combines real-time expense tracking, interactive budgeting, savings goals, and rich analytics — all wrapped in a premium glassmorphism UI with subtle three-dimensional accents.

### Key Features

- **Dashboard** — Real-time financial snapshot with animated metric cards, recent transactions, and quick stats
- **Analytics** — Interactive Recharts visualizations (bar, pie, area) with category breakdowns and monthly trends
- **Budgets** — Set monthly spending limits per category with visual progress tracking
- **Savings Goals** — Define financial targets, track progress, and quick-add contributions
- **Transactions** — Full CRUD with search, filter by category, sort by date/amount, pagination
- **Profile** — Update name, currency, monthly income
- **Authentication** — Email/password auth via Supabase with protected routes
- **Theme** — Dark/light mode with persistent preference
- **3D Accents** — Three.js-powered financial particles on landing, interactive finance orb on demo
- **Animations** — GSAP scroll-triggered entrance animations, Framer Motion page transitions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4, Glassmorphism |
| **UI Components** | Shadcn UI + Base UI (Radix-inspired) |
| **State** | Zustand |
| **Database** | Supabase (PostgreSQL with Row-Level Security) |
| **Auth** | Supabase Auth (email/password, session via cookies) |
| **Charts** | Recharts |
| **3D** | Three.js, React Three Fiber, Drei |
| **Animations** | GSAP (ScrollTrigger), Framer Motion |
| **Deployment** | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project ([supabase.com](https://supabase.com))

### Installation

```bash
git clone https://github.com/RAJ-SUHANDANI/VaultIQ.git
cd VaultIQ
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Setup

1. Go to your Supabase Dashboard → SQL Editor
2. Paste and run the contents of `supabase/migrations.sql`
3. This creates all tables (profiles, categories, expenses, budgets, savings_goals), enables Row-Level Security, creates policies, and sets up the auto-profile trigger

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & Signup pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/       # Protected dashboard pages
│   │   ├── analytics/   # Recharts visualizations
│   │   ├── budgets/     # Budget & savings goals
│   │   ├── profile/     # User settings
│   │   ├── transactions/# Transaction history
│   │   └── page.tsx     # Main dashboard
│   ├── layout.tsx       # Root layout (ThemeProvider, AuthProvider)
│   └── page.tsx         # Landing page
├── components/
│   ├── dashboard/       # Dashboard-specific components
│   │   ├── BudgetRing.tsx
│   │   ├── ExpenseModal.tsx
│   │   ├── Header.tsx
│   │   ├── MetricCard.tsx
│   │   └── Sidebar.tsx
│   ├── landing/         # Landing page sections
│   ├── shared/          # AuthProvider, ThemeProvider, AnimatedCounter
│   ├── three/           # Three.js components
│   └── ui/              # Shadcn UI primitives
├── hooks/               # Custom React hooks
├── lib/
│   ├── supabase/        # Client, server, middleware, queries
│   ├── store.ts         # Zustand state management
│   ├── types.ts         # TypeScript interfaces
│   └── utils.ts         # Utilities
└── middleware.ts        # Next.js middleware (auth redirect)
```

---

## API & Data Flow

All data is persisted in Supabase with Row-Level Security. Each user can only see their own data.

- **Zustand** store acts as the client-side cache, synced with Supabase on initial load via `useDataLoader` hook
- **Auth** uses Supabase's REST API directly (to avoid SSR client issues), with token exchange via `setSession`
- **Queries** in `src/lib/supabase/queries.ts` provide async CRUD helpers that update both Supabase and the local store

---

## Screenshots

| Page | Description |
|------|-------------|
| `/` | Landing with 3D particle animation, features, demo orb |
| `/signup` | Glassmorphism signup form |
| `/login` | Login form with auth redirect |
| `/dashboard` | Metric cards, recent transactions, quick stats |
| `/dashboard/analytics` | Bar, pie, and area charts from real expense data |
| `/dashboard/budgets` | Monthly budgets (per category) + savings goals |
| `/dashboard/transactions` | Searchable, filterable, paginated expense table |
| `/dashboard/profile` | User profile settings |


## LIVE PREVIEW
The website is currently deployed on [https://vaultiq-eight.vercel.app/](https://vaultiq-eight.vercel.app/).

