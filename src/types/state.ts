import type { RoutineEntry, User } from "./models";

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
