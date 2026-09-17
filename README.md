# FitTracker

FitTracker is a fitness tracking application built with React, TypeScript, and Vite. The project supports personal routine planning, exercise catalog management, external API searches, weekly load tracking, and a final system dashboard that summarizes the full domain state.

## Overview

This project is structured around a unified storage layer that manages all major entities through a single generic repository pattern. It also includes a final dashboard for the closing sprint, where the system displays:

- registered users
- total exercises in the catalog
- local vs external API exercise counts
- active routines
- per-user weekly load summaries and rest recommendations
- recent activity log

## Main Features

- user profile setup and routine assignment
- exercise creation and assignment by day
- weekly routine tracking with status updates
- external exercise lookup from API-Ninjas
- unified exercise reporting by category
- instructor-style monitoring view
- final dashboard summary for closing sprint
- workspace tab navigation for a cleaner experience in the main app view

## Tech Stack

- React 19
- TypeScript with strict mode
- Vite
- Zustand
- React Hook Form
- API-Ninjas Exercises API

## Project Structure

```text
.
├── .env
├── README.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── src/
│   ├── App.tsx                     # Main application shell and workspace navigation
│   ├── App.css                    # Global layout and navigation styling
│   ├── index.css                  # Base CSS reset and global defaults
│   ├── components/
│   │   ├── catalog/
│   │   │   ├── ExerciseCatalog.tsx
│   │   │   ├── UnifiedReport.tsx
│   │   │   └── ...
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Dashboard.css
│   │   ├── forms/
│   │   │   ├── Profile/
│   │   │   └── Excersise/
│   │   ├── generic/
│   │   │   └── summary.tsx
│   │   ├── routine/
│   │   │   ├── InstructorView.tsx
│   │   │   ├── RoutineSessions.tsx
│   │   │   ├── WeeklyLoadCard.tsx
│   │   │   └── RoutineViews.css
│   │   ├── search/
│   │   │   ├── ExerciseSearch.tsx
│   │   │   └── ExerciseSearch.css
│   │   └── ...
│   ├── services/
│   │   └── exerciseApi.ts         # API validation and fetch logic
│   ├── store/
│   │   ├── GenericStore.ts        # Generic repository for all entities
│   │   ├── entityStores.ts        # Entity-specific store instances
│   │   ├── userStore.tsx          # Zustand store used by the app
│   │   └── ...
│   ├── types/
│   │   ├── enums.ts               # Domain enums and literal unions
│   │   ├── forms.ts               # Form and prop types
│   │   ├── models.ts              # Domain models and dashboard contracts
│   │   ├── state.ts               # Zustand state typings
│   │   └── store.ts               # Generic storage contracts
│   ├── utils/
│   │   ├── calculations.ts        # Business logic, weekly load, recommendations, reports
│   │   ├── descriptions.ts        # Description helpers
│   │   ├── seedData.ts            # Demo seed data for default usage
│   │   └── ...
│   └── vite-env.d.ts
```

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm

### Environment variables

Create a `.env` file in the project root with your API-Ninjas key:

You can create the key here: [API Ninjas](https://api-ninjas.com/)

```env
VITE_API_NINJAS_KEY=your_api_key_here
```

### Install dependencies

```bash
npm install
```

### Run the app in development mode

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Lint the project

```bash
npm run lint
```

### Type-check the project

```bash
npx tsc --noEmit
```

### Production build

```bash
npm run build
```