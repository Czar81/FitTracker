import type { Exercise, UserProfile } from "./models";
import type { DayOfWeek, ExerciseId, WorkoutStatus } from "./enums";

export interface UserState {
  user: UserProfile | null;
  isProfileSet: boolean;
  setProfile: (data: UserProfile) => void;
  addExercise: (day: DayOfWeek, exercise: Exercise) => void;
  setExerciseStatus: (day: DayOfWeek, exerciseId: ExerciseId, status: WorkoutStatus) => void;
  setSessionComment: (day: DayOfWeek, comment: string) => void;
}
