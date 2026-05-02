import type { DayOfWeek, ExperienceLevel } from "./enums";
import type { RoutineEntry } from "./models";

export interface ExerciseFormInput {
  day: DayOfWeek;
  exerciseName: string;
  durationMinutes: number;
  caloriesPerMinute: number;
  distanceKm?: number;
}

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
