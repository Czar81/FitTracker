import type { DayOfWeek, ExperienceLevel, MembershipLevel, ExerciseCategory, ExerciseId, UserId, RoutineId } from "./enums";

interface ExerciseBase {
  id: ExerciseId;
  name: string;
  durationMinutes: number;
  caloriesPerMinute: number;
}

export interface CardioExercise extends ExerciseBase {
    type: "Cardio";
    distanceKm: number;
    rhythm: number;
    heartRateZone: string;
}

export interface StrengthExercise extends ExerciseBase {
    type: "Strength";
    sets: number;
    weight: number;
    repetitions: number;
}

export interface FlexibilityExercise extends ExerciseBase {
    type: "Flexibility";
    poses: number;
}

export type Exercise = CardioExercise | StrengthExercise | FlexibilityExercise;

export interface RoutineEntry {
  day: DayOfWeek;
  exercise: Exercise;
}

export interface WeeklyRoutine {
  id: RoutineId;
  name: string;
  entries: RoutineEntry[];
}

export interface User {
  id: UserId;
  name: string;
  age: number;
  experienceLevel: ExperienceLevel;
  assignedRoutine: WeeklyRoutine;
}

export interface UserMembership {
  membershipLevel: MembershipLevel;
  memberSince: string;
  isActive: boolean;
}

export type UserProfile = User & UserMembership;

export interface ExercisePercentage {
  exerciseName: string;
  day: DayOfWeek;
  percentage: number;
}

export interface CategoryGroup {
  category: ExerciseCategory;
  entries: RoutineEntry[];
  totalMinutes: number;
  totalCalories: number;
  bonusCount: number; // contador de bonus según regla de negocio
}

export interface CatalogSummary {
  cardio: CategoryGroup;
  strength: CategoryGroup;
  flexibility: CategoryGroup;
}