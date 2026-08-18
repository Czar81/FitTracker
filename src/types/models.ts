import type { DayOfWeek, ExperienceLevel, MembershipLevel, ExerciseCategory, ExerciseId, RoutineId, InstructorId, RecommendationLevel } from "./enums";

interface ExerciseBase {
  id: ExerciseId;
  name: string;
  durationMinutes: number;
  caloriesPerMinute: number;
  completed: boolean;
}

export interface CardioExercise extends ExerciseBase {
    type: "Cardio";
    distanceKm: number;
    rhythm: number;
    heartRateZone: string;
    caloriesBurned: number;
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
    comments?: string;
}

export type Exercise = CardioExercise | StrengthExercise | FlexibilityExercise;

export interface RoutineEntry {
  day: DayOfWeek;
  exercise: Exercise;
}

export interface DaySession {
  day: DayOfWeek;
  exercises: Exercise[];
  comment?: string;
}

export interface WeeklyRoutine {
  id: RoutineId;
  name: string;
  startDate: string;
  sessions: DaySession[];
}

export interface Person {
  id: string;
  name: string;
  age: number;
  email: string;
}

export interface User extends Person {
  experienceLevel: ExperienceLevel;
  assignedRoutine: WeeklyRoutine;
}

export interface UserMembership {
  membershipLevel: MembershipLevel;
  memberSince: string;
  isActive: boolean;
}

export type UserProfile = User & UserMembership;

export interface Instructor extends Person {
  id: InstructorId;
  assignedUsers: UserProfile[];
}

export interface WeeklyLoad {
  totalMinutes: number;
  totalCalories: number;
  cardioMinutes: number;
  strengthMinutes: number;
  flexibilityMinutes: number;
  daysTrained: number;
}

export interface RestRecommendation {
  level: RecommendationLevel;
  message: string;
}

// Contratos formales de las funciones de cálculo (firma antes que implementación)
export interface FlattenRoutine {
  (routine: WeeklyRoutine): RoutineEntry[];
}

export interface CalculateWeeklyLoad {
  (routine: WeeklyRoutine): WeeklyLoad;
}

export interface GetRestRecommendation {
  (load: WeeklyLoad): RestRecommendation;
}

export interface FindBestCalorieRoutineDay {
  (routine: WeeklyRoutine): DaySession | null;
}

export interface GetPendingExercises {
  (routine: WeeklyRoutine): RoutineEntry[];
}

export interface AddExerciseToRoutine {
  (routine: WeeklyRoutine, day: DayOfWeek, exercise: Exercise): WeeklyRoutine;
}

export interface ToggleExerciseCompleted {
  (routine: WeeklyRoutine, day: DayOfWeek, exerciseId: ExerciseId): WeeklyRoutine;
}

export interface SetSessionComment {
  (routine: WeeklyRoutine, day: DayOfWeek, comment: string): WeeklyRoutine;
}

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