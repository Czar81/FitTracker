import type { DayOfWeek, ExperienceLevel, ExerciseCategory, MembershipLevel } from "./enums";
import type { RoutineEntry, CategoryGroup, CatalogSummary } from "./models";

export interface ProfileFormInput {
  name: string;
  age: number;
  experienceLevel: ExperienceLevel;
  membershipLevel: MembershipLevel;
}

export type ExerciseFormProps = {
  onExerciseAdded?: () => void;
};

export type ExerciseListProps = {
  entries: RoutineEntry[];
};

export type ExerciseCatalogProps = {
  entries: RoutineEntry[];
};

export type CategoryBlockProps = {
  group: CategoryGroup;
  label: string;
};

export type CatalogSummaryBarProps = {
  summary: CatalogSummary;
};

export type SummaryProps = {
  entries: RoutineEntry[];
};

interface BaseExerciseFormInput {
  day: DayOfWeek;
  exerciseName: string;
  durationMinutes: number;
  caloriesPerMinute: number;
  category: ExerciseCategory;
}

interface CardioFormFields {
  category: "Cardio";
  distanceKm: number;
  heartRateZone: string;
}

interface StrengthFormFields {
  category: "Strength";
  sets: number;
  weight: number;
  repetitions: number;
}

interface FlexibilityFormFields {
  category: "Flexibility";
  poses: number;
}

export type ExerciseFormInput = BaseExerciseFormInput &
  (CardioFormFields | StrengthFormFields | FlexibilityFormFields);

export type FlatExerciseFormInput = {
  day: DayOfWeek;
  exerciseName: string;
  durationMinutes: number;
  caloriesPerMinute: number;
  category: ExerciseCategory;
  // Cardio
  distanceKm?: number;
  heartRateZone?: string;
  // Strength
  sets?: number;
  weight?: number;
  repetitions?: number;
  // Flexibility
  poses?: number;
};
