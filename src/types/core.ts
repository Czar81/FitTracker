export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type CaloriesPerMinute = number;

export interface Exercise {
  name: string;
  durationMinutes: number;
  caloriesPerMinute: CaloriesPerMinute;
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

export interface ExerciseState {
  entries: RoutineEntry[];
  addExercise: (entry: RoutineEntry) => void;
}

export interface UserState {
  user: User | null;
  isProfileSet: boolean;
  setProfile: (data: User) => void;
  updateUserRoutine: (entries: RoutineEntry[]) => void;
}

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
