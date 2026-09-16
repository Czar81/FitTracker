# FitTracker

A fitness tracking web app built with React, TypeScript, and Vite. Users build a weekly routine of exercises grouped by day, track completion and weekly load, search external exercise catalogs via API, and generate unified category reports. Instructors can also monitor supervised users.

## Tech Stack

- React 19
- TypeScript (strict mode)
- Vite
- Zustand (global state)
- React Hook Form (form handling)
- API-Ninjas Exercises API (external exercise lookup)

## Project Structure

```text
.
├── .env
└── src/
    ├── types/
    │   ├── models.ts              # Domain entities: Exercise (Cardio, Strength, Flexibility), DaySession, ExternalExerciseRaw, etc.
    │   ├── enums.ts                # Literal unions (WorkoutState, MuscleGroup) and id aliases
    │   ├── forms.ts                 # Form input and component prop types
    │   └── state.ts                  # Zustand store contract & search state definitions
    ├── services/
    │   └── exerciseApi.ts         # External API fetcher (api-ninjas.com) with strict type checks
    ├── utils/
    │   ├── calculations.ts        # Pure functions: calcCalories, calculateWeeklyLoad, etc.
    │   ├── descriptions.ts         # Per-category exercise description text
    │   └── seedData.ts               # Demo data for testing & instructor views
    ├── store/
    │   └── userStore.tsx            # Zustand store (Users, Catalog, Routines & External Search state)
    └── components/
        ├── forms/
        │   ├── Profile/            # Profile registration form
        │   └── Excersise/           # Add-exercise form (assigns to a day)
        ├── catalog/                  # Category breakdown & UnifiedReport component
        ├── search/                   # ExerciseSearch component (API lookup & incomplete data handling)
        ├── routine/
        │   ├── RoutineSessions.tsx  # Day-by-day session view with WorkoutState (pendiente/completado/saltado)
        │   ├── WeeklyLoadCard.tsx    # Weekly load & rest recommendation
        │   └── InstructorView.tsx    # Instructor view of supervised users
        └── generic/
            └── summary.tsx            # Comparative summary
```

## Getting Started

### Prerequisites

* Node.js 20.19+ (or 22.12+)
* npm

### Environment Variables

Create a `.env` file in the root directory and add your API-Ninjas key:

You can create the key here [api-ninjas](https://api-ninjas.com/)

```env
VITE_API_NINJAS_KEY=your_api_key_here

```

### Installation

Clone this repo, then install dependencies:

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