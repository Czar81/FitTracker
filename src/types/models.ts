import type { DayOfWeek, ExperienceLevel } from "./enums";

export interface Exercise {
  name: string;
  durationMinutes: number;
  caloriesPerMinute: number;
  distanceKm?: number;
}

export interface RoutineEntry {
  day: DayOfWeek;
  exercise: Exercise;
}

export interface WeeklyRoutine {
  name: string;
  entries: RoutineEntry[];
}

export interface User {
  name: string;
  age: number;
  experienceLevel: ExperienceLevel;
  assignedRoutine: WeeklyRoutine;
}

export interface ExercisePercentage {
  exerciseName: string;
  day: DayOfWeek;
  percentage: number;
}
