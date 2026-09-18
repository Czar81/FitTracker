import type { Exercise, ExternalExerciseValidation, UserProfile, WeeklyRoutine } from "./models";
import type { DayOfWeek, ExerciseId, WorkoutStatus } from "./enums";
import type { StoredEntity } from "./store";

export interface UserState {
  user: UserProfile | null;
  isProfileSet: boolean;
  incompleteExternalExercises: ExternalExerciseValidation[];
  // Sprint 4: reactive snapshots of the unified store (GenericStore), so the
  // dashboard updates whenever something changes there.
  users: StoredEntity<UserProfile>[];
  exerciseCatalog: StoredEntity<Exercise>[];
  routines: StoredEntity<WeeklyRoutine>[];
  activityLog: string[];
  setProfile: (data: UserProfile) => void;
  setIncompleteExternalExercises: (results: ExternalExerciseValidation[]) => void;
  addExercise: (day: DayOfWeek, exercise: Exercise) => void;
  setExerciseStatus: (day: DayOfWeek, exerciseId: ExerciseId, status: WorkoutStatus) => void;
  setSessionComment: (day: DayOfWeek, comment: string) => void;
}
