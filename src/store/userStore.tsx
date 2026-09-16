import { create } from "zustand";
import type { Exercise, ExternalExerciseValidation, UserProfile } from "../types/models";
import type { DayOfWeek, ExerciseId, WorkoutStatus } from "../types/enums";
import type { UserState } from "../types/state";
import { addExerciseToRoutine, setExerciseStatus, setSessionComment } from "../utils/calculations";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isProfileSet: false,
  incompleteExternalExercises: [],

  setProfile: (data: UserProfile): void => set({ user: data, isProfileSet: true }),

  setIncompleteExternalExercises: (results: ExternalExerciseValidation[]): void =>
    set({ incompleteExternalExercises: results }),

  addExercise: (day: DayOfWeek, exercise: Exercise): void =>
    set((state: UserState) => {
      if (state.user === null) return {};
      return {
        user: { ...state.user, assignedRoutine: addExerciseToRoutine(state.user.assignedRoutine, day, exercise) },
      };
    }),

  setExerciseStatus: (day: DayOfWeek, exerciseId: ExerciseId, status: WorkoutStatus): void =>
    set((state: UserState) => {
      if (state.user === null) return {};
      return {
        user: {
          ...state.user,
          assignedRoutine: setExerciseStatus(state.user.assignedRoutine, day, exerciseId, status),
        },
      };
    }),

  setSessionComment: (day: DayOfWeek, comment: string): void =>
    set((state: UserState) => {
      if (state.user === null) return {};
      return {
        user: { ...state.user, assignedRoutine: setSessionComment(state.user.assignedRoutine, day, comment) },
      };
    }),
}));
