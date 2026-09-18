import { create } from "zustand";
import type { Exercise, ExternalExerciseValidation, UserProfile } from "../types/models";
import type { DayOfWeek, ExerciseId, WorkoutStatus } from "../types/enums";
import type { UserState } from "../types/state";
import { addExerciseToRoutine, setExerciseStatus, setSessionComment } from "../utils/calculations";
import {
  userEntityStore,
  exerciseEntityStore,
  routineEntityStore,
  registerUser,
  registerExercise,
  registerRoutine,
  syncRoutine,
  logActivity,
  getActivityLog,
} from "./entityStores";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isProfileSet: false,
  incompleteExternalExercises: [],
  users: userEntityStore.getAll(),
  exerciseCatalog: exerciseEntityStore.getAll(),
  routines: routineEntityStore.getAll(),
  activityLog: getActivityLog(),

  setProfile: (data: UserProfile): void =>
    set((): Partial<UserState> => {
      registerUser(data);
      registerRoutine(data.assignedRoutine);
      const activityLog = logActivity(`Perfil creado: ${data.name}`);
      return {
        user: data,
        isProfileSet: true,
        users: userEntityStore.getAll(),
        routines: routineEntityStore.getAll(),
        activityLog,
      };
    }),

  setIncompleteExternalExercises: (results: ExternalExerciseValidation[]): void =>
    set({ incompleteExternalExercises: results }),

  addExercise: (day: DayOfWeek, exercise: Exercise): void =>
    set((state: UserState): Partial<UserState> => {
      if (state.user === null) return {};
      const assignedRoutine = addExerciseToRoutine(state.user.assignedRoutine, day, exercise);
      const user = { ...state.user, assignedRoutine };
      registerExercise(exercise);
      syncRoutine(assignedRoutine);
      const originLabel = exercise.source === "api" ? "desde API" : "local";
      const activityLog = logActivity(`${exercise.name} agregado (${originLabel}), ${user.name}`);
      return {
        user,
        exerciseCatalog: exerciseEntityStore.getAll(),
        routines: routineEntityStore.getAll(),
        activityLog,
      };
    }),

  setExerciseStatus: (day: DayOfWeek, exerciseId: ExerciseId, status: WorkoutStatus): void =>
    set((state: UserState): Partial<UserState> => {
      if (state.user === null) return {};
      const assignedRoutine = setExerciseStatus(state.user.assignedRoutine, day, exerciseId, status);
      const user = { ...state.user, assignedRoutine };
      syncRoutine(assignedRoutine);
      const changedExercise = assignedRoutine.sessions
        .find((session) => session.day === day)
        ?.exercises.find((item) => item.id === exerciseId);
      const activityLog =
        changedExercise === undefined
          ? logActivity(`Ejercicio ID ${exerciseId} no encontrado`)
          : logActivity(`${changedExercise.name} actualizado, ${user.name} (estado: ${status})`);
      return { user, routines: routineEntityStore.getAll(), activityLog };
    }),

  setSessionComment: (day: DayOfWeek, comment: string): void =>
    set((state: UserState): Partial<UserState> => {
      if (state.user === null) return {};
      const assignedRoutine = setSessionComment(state.user.assignedRoutine, day, comment);
      syncRoutine(assignedRoutine);
      return {
        user: { ...state.user, assignedRoutine },
        routines: routineEntityStore.getAll(),
      };
    }),
}));
