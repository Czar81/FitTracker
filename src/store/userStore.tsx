import { create } from "zustand";
import type { User, RoutineEntry, UserState } from "../types/core";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isProfileSet: false,
  setProfile: (data: User): void =>
    set({ user: data, isProfileSet: true }),
  updateUserRoutine: (entries: RoutineEntry[]): void =>
    set((state: UserState) => {
      if (state.user === null) return state;
      return {
        ...state,
        user: {
          ...state.user,
          assignedRoutine: { ...state.user.assignedRoutine, entries },
        },
      };
    }),
}));
