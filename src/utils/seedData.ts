import type { Exercise, Instructor, UserProfile } from "../types/models";

const squats: Exercise = {
  id: "seed-squats",
  type: "Strength",
  name: "Squats",
  durationMinutes: 45,
  caloriesPerMinute: 9,
  completed: true,
  sets: 4,
  weight: 60,
  repetitions: 12,
};

const cycling: Exercise = {
  id: "seed-cycling",
  type: "Cardio",
  name: "Cycling",
  durationMinutes: 40,
  caloriesPerMinute: 10,
  completed: true,
  distanceKm: 15,
  rhythm: 2.67,
  heartRateZone: "Zona 3",
  caloriesBurned: 400,
};

const pilates: Exercise = {
  id: "seed-pilates",
  type: "Flexibility",
  name: "Pilates",
  durationMinutes: 35,
  caloriesPerMinute: 5,
  completed: true,
  poses: 8,
  comments: "Buena sesión de movilidad",
};

const deadlift: Exercise = {
  id: "seed-deadlift",
  type: "Strength",
  name: "Deadlift",
  durationMinutes: 60,
  caloriesPerMinute: 11,
  completed: false,
  sets: 5,
  weight: 90,
  repetitions: 8,
};

export const anaGarcia: UserProfile = {
  id: "seed-user-ana",
  name: "Ana García",
  age: 27,
  email: "ana.garcia@example.com",
  experienceLevel: "Intermediate",
  membershipLevel: "Premium",
  memberSince: "2025-11-02",
  isActive: true,
  assignedRoutine: {
    id: "seed-routine-ana",
    name: "Full Body Plan",
    startDate: "2026-08-11",
    sessions: [
      { day: "Monday", exercises: [squats] },
      { day: "Tuesday", exercises: [cycling] },
      { day: "Thursday", exercises: [pilates] },
      { day: "Saturday", exercises: [deadlift] },
    ],
  },
};

export const buildInstructor = (currentUser: UserProfile): Instructor => ({
  id: "seed-instructor-sofia",
  name: "Sofía Ramírez",
  age: 34,
  email: "sofia.ramirez@fittracker.com",
  assignedUsers: [currentUser, anaGarcia],
});
