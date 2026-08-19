# FitTracker

A fitness tracking web app built with React, TypeScript, and Vite. Users build a weekly routine of exercises grouped by day, track completion and weekly load, and instructors can see the status of the users they supervise.

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
│   ├── models.ts              # Domain entities: Exercise, DaySession, WeeklyRoutine, Person/User/Instructor, WeeklyLoad, function contracts
│   ├── enums.ts                # Literal unions and id aliases
│   ├── forms.ts                 # Form input and component prop types
│   └── state.ts                  # Zustand store contract
├── utils/
│   ├── calculations.ts        # Pure functions: calcCalories, groupByCategory, calculateWeeklyLoad, getRestRecommendation, immutable routine updates, etc.
│   ├── descriptions.ts         # Per-category exercise description text
│   └── seedData.ts               # Demo instructor + a second demo user, so the instructor view has more than one supervised user
├── store/
│   └── userStore.tsx            # User + assigned routine global state (Zustand)
└── components/
    ├── forms/
    │   ├── Profile/            # Profile registration form
    │   └── Excersise/           # Add-exercise form (assigns to a day, forms/extends a session)
    ├── catalog/                  # Category breakdown of the routine's exercises
    ├── routine/
    │   ├── RoutineSessions.tsx  # Day-by-day session view: toggle completed, edit day comment
    │   ├── WeeklyLoadCard.tsx    # Weekly load, rest recommendation, best day, pending exercises
    │   └── InstructorView.tsx    # Instructor's view of supervised users
    └── generic/
        └── summary.tsx            # Comparative summary
```

## Getting Started

### Prerequisites

- Node.js 20.19+ (or 22.12+)
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
npx tsc -b
```

### Build for production

```bash
npm run build
```

## Features

- Register a user profile (name, age, email, experience level)
- Build a weekly routine from the UI: add exercises to specific days, forming sessions with one or more exercises each
- Mark exercises as completed, add a comment per day session
- Weekly load: total minutes, total calories, and time breakdown per category (cardio/strength/flexibility)
- Rest recommendation based on days trained and total weekly minutes
- Instructor view: supervised users with their routine name and weekly summary
- Bonus: highlights the day with the highest calorie burn, and lists all pending (not completed) exercises

## Constraints

- No `any` types anywhere in the codebase
- All entities modeled with `interface`; `type` reserved for literal unions and form/prop aliases
- Calculation functions have formal call-signature contracts declared before their implementation
- Routine-modifying operations return updated copies — no mutation of existing state
- No backend or persistence — state resets on page reload
- Compiles clean with `tsc -b`
