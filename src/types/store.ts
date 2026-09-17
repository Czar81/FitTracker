// --- Sprint 4: unified storage layer -----------------------------------------
// Minimum contract any entity must fulfill to be stored in a GenericStore: a
// numeric `id` field (a requirement imposed by the assignment).
export interface HasNumericId {
  id: number;
}

// Generic wrapper: gives any domain entity that uses string IDs, such as
// Exercise/UserProfile/WeeklyRoutine, its own numeric store ID without changing
// the original types.
export interface StoredEntity<T> extends HasNumericId {
  data: T;
}
