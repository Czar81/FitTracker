import { create } from "zustand";
import type { Exercise, UserProfile } from "../types/models";
import type { DayOfWeek, ExerciseId } from "../types/enums";
import type { UserState } from "../types/state";
import { addExerciseToRoutine, toggleExerciseCompleted, setSessionComment } from "../utils/calculations";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isProfileSet: false,

  setProfile: (data: UserProfile): void => set({ user: data, isProfileSet: true }),

  addExercise: (day: DayOfWeek, exercise: Exercise): void =>
    set((state: UserState) => {
      if (state.user === null) return {};
      return {
        user: { ...state.user, assignedRoutine: addExerciseToRoutine(state.user.assignedRoutine, day, exercise) },
      };
    }),

  toggleExerciseCompleted: (day: DayOfWeek, exerciseId: ExerciseId): void =>
    set((state: UserState) => {
      if (state.user === null) return {};
      return {
        user: {
          ...state.user,
          assignedRoutine: toggleExerciseCompleted(state.user.assignedRoutine, day, exerciseId),
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
