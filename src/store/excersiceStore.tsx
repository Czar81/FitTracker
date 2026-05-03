import { create } from "zustand";
import type { RoutineEntry, ExerciseState } from "../types/core";
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
