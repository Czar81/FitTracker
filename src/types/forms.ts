import type { DayOfWeek, ExperienceLevel, ExerciseCategory } from "./enums";
import type { RoutineEntry } from "./models";

export interface ProfileFormInput {
  name: string;
  age: number;
  experienceLevel: ExperienceLevel;
}

export type ExerciseFormProps = {
  onExerciseAdded?: () => void;
};

export type ExerciseListProps = {
  entries: RoutineEntry[];
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
  rhythm: number;
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
  positions: number;
}

export type ExerciseFormInput =
  BaseExerciseFormInput &
  (CardioFormFields | StrengthFormFields | FlexibilityFormFields);