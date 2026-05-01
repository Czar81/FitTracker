import { create } from "zustand";
import type { User } from "../types/core";

interface UserState {
  user: User | null;
  isProfileSet: boolean;
  setProfile: (data: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isProfileSet: false,
  setProfile: (data: User) =>
    set({ user: data, isProfileSet: true }),
}));
