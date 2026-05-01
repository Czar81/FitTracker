import { create } from "zustand";
import type { RoutineEntry } from "../types/core";

interface ExerciseState {
  entries: RoutineEntry[];
  addExercise: (entry: RoutineEntry) => void;
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  entries: [],
  addExercise: (entry: RoutineEntry) =>
    set((state) => ({ entries: [...state.entries, entry] })),
}));
