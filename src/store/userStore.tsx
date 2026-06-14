import { create } from "zustand";
import type { RoutineEntry, UserProfile } from "../types/models";
import type { UserState } from "../types/state";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isProfileSet: false,
  setProfile: (data: UserProfile): void =>
    set({ user: data, isProfileSet: true }),

  updateUserRoutine: (entries: RoutineEntry[]): void =>
    set((state: UserState) => {
      if (state.user === null) return {};
      return {
        user: {
          ...state.user,
          assignedRoutine: {
            ...state.user.assignedRoutine,
            entries: entries,
          },
        },
      };
    }),
}));
