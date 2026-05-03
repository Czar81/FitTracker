# FitTracker

A fitness tracking web app built with React, TypeScript, and Vite. Users can register their profile, log exercises, and view workout statistics.

## Tech Stack

- React 19
- TypeScript (strict mode)
- Vite
- Zustand (global state)
- React Hook Form (form handling)

## Project Structure

```
src/
├── types/
│   └── core.ts               # Domain types: Exercise, User, RoutineEntry, WeeklyRoutine
├── utils/
│   └── calculations.ts       # Pure functions: calcCalories, calcPace, formatDuration, etc.
├── store/
│   ├── userStore.tsx          # User global state (Zustand)
│   └── excersiceStore.tsx     # Exercise entries global state (Zustand)
└── components/
    ├── forms/
    │   ├── Profile/           # Profile registration form
    │   └── Excersise/         # Exercise registration form
    └── generic/
        ├── excersiceSummary.tsx  # Exercise list with stats
        └── summary.tsx           # Comparative summary
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

Clone this repo, then

```bash
npm install
```

### Run in development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Type check

```bash
npx tsc --noEmit
```

### Build for production

```bash
npm run build
```

## Features

- Register a user profile (name, age, experience level)
- Log exercises with duration and calories per minute
- Optional distance tracking for cardio exercises (enables pace calculation)
- Auto-calculated stats per exercise: calories burned, pace (min/km)
- Routine totals: total calories and average calories per training day
- Comparative summary: longest exercise, most calories burned and its percentage of the total
- Bonus: highlights the day with the highest calorie burn

## Constraints

- No `any` types anywhere in the codebase
- All function parameters are explicitly typed
- No backend or persistence — state resets on page reload
- Compiles clean with `tsc --strict`