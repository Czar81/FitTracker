import { GenericStore } from "./GenericStore";
import type { StoredEntity } from "../types/store";
import type { UserProfile, Exercise, WeeklyRoutine } from "../types/models";
import { anaGarcia } from "../utils/seedData";

// --- Sprint 4: integrating previous sprints with the unified store -----------
// One GenericStore per entity type. All app operations go through this layer;
// user, exercise, and routine arrays are never manipulated directly.
export const userEntityStore = new GenericStore<StoredEntity<UserProfile>>();
export const exerciseEntityStore = new GenericStore<StoredEntity<Exercise>>();
export const routineEntityStore = new GenericStore<StoredEntity<WeeklyRoutine>>();

let nextUserId = 1;
let nextExerciseId = 1;
let nextRoutineId = 1;

export const registerUser = (user: UserProfile): StoredEntity<UserProfile> =>
  userEntityStore.add({ id: nextUserId++, data: user });

export const registerExercise = (exercise: Exercise): StoredEntity<Exercise> =>
  exerciseEntityStore.add({ id: nextExerciseId++, data: exercise });

export const registerRoutine = (routine: WeeklyRoutine): StoredEntity<WeeklyRoutine> =>
  routineEntityStore.add({ id: nextRoutineId++, data: routine });

// Updates a user's routine in the store after an operation (adding an exercise,
// changing its status, or adding a session comment) without creating a new
// entry. The stored routine is found by its domain WeeklyRoutine.id and its
// complete `data` value is replaced (partial update: only the `data` field).
export const syncRoutine = (routine: WeeklyRoutine): void => {
  const stored = routineEntityStore.findByCriteria((entry) => entry.data.id === routine.id)[0];
  if (stored === undefined) {
    registerRoutine(routine);
    return;
  }
  routineEntityStore.updatePartial(stored.id, { data: routine });
};

const MAX_ACTIVITY_ENTRIES = 6;
let activityLog: string[] = [];

export const logActivity = (message: string): string[] => {
  activityLog = [message, ...activityLog].slice(0, MAX_ACTIVITY_ENTRIES);
  return [...activityLog];
};

export const getActivityLog = (): string[] => [...activityLog];

// --- Initial seed: Ana Garcia is already registered with her routine and catalog
anaGarcia.assignedRoutine.sessions
  .flatMap((session) => session.exercises)
  .forEach((exercise) => registerExercise(exercise));
registerUser(anaGarcia);
registerRoutine(anaGarcia.assignedRoutine);
logActivity(`Usuario semilla cargado: ${anaGarcia.name}`);
