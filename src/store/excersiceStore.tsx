import { create } from "zustand";
import type { RoutineEntry } from "../types/models";
import type { ExerciseState } from "../types/state";
import { useUserStore } from "./userStore";

export const useExerciseStore = create<ExerciseState>((set) => ({
  entries: [],
  addExercise: (entry: RoutineEntry): void =>
    set((state: ExerciseState) => {
      const updatedEntries = [...state.entries, entry];
      useUserStore.getState().updateUserRoutine(updatedEntries);
      return { entries: updatedEntries };
    }),
}));
