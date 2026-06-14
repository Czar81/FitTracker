import type { RoutineEntry, UserProfile } from "./models";

export interface ExerciseState {
  entries: RoutineEntry[];
  addExercise: (entry: RoutineEntry) => void;
}

export interface UserState {
  user: UserProfile | null;
  isProfileSet: boolean;
  setProfile: (data: UserProfile) => void;
  updateUserRoutine: (entries: RoutineEntry[]) => void;
}
