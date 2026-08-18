import type { Exercise, UserProfile } from "./models";
import type { DayOfWeek, ExerciseId } from "./enums";

export interface UserState {
  user: UserProfile | null;
  isProfileSet: boolean;
  setProfile: (data: UserProfile) => void;
  addExercise: (day: DayOfWeek, exercise: Exercise) => void;
  toggleExerciseCompleted: (day: DayOfWeek, exerciseId: ExerciseId) => void;
  setSessionComment: (day: DayOfWeek, comment: string) => void;
}
