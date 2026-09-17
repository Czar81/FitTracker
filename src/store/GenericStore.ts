import type { HasNumericId } from "../types/store";

// --- Sprint 4: generic store -------------------------------------------------
// A single structure that works for any entity as long as it has a numeric `id`.
// Users, exercises, and routines use the same class; only the instantiated type
// changes (see src/store/entityStores.ts).
export class GenericStore<T extends HasNumericId> {
  private entities: T[] = [];

  // 1. Add an entity.
  add(entity: T): T {
    this.entities.push(entity);
    return { ...entity };
  }

  // 2. Get all entities. The internal array is never exposed: a shallow copy of
  // each element is returned.
  getAll(): T[] {
    return this.entities.map((entity: T): T => ({ ...entity }));
  }

  // 3. Find by ID. If it does not exist, return `undefined` instead of throwing
  // an error: the caller decides how to communicate "not found".
  findById(id: number): T | undefined {
    const found = this.entities.find((entity: T): boolean => entity.id === id);
    return found === undefined ? undefined : { ...found };
  }

  // 4. Delete by ID. Return true if something was deleted, or false if the ID
  // did not exist.
  deleteById(id: number): boolean {
    const lengthBefore = this.entities.length;
    this.entities = this.entities.filter((entity: T): boolean => entity.id !== id);
    return this.entities.length < lengthBefore;
  }

  // 5. Partially update. Receives only the fields that change (`id` can never be
  // overwritten here) and returns the updated entity, or `undefined` if the ID
  // was not found.
  updatePartial(id: number, changes: Partial<Omit<T, "id">>): T | undefined {
    const index = this.entities.findIndex((entity: T): boolean => entity.id === id);
    if (index === -1) return undefined;

    const current = this.entities[index];
    const updated: T = { ...current, ...changes };
    this.entities[index] = updated;
    return { ...updated };
  }

  // 6. Search with a custom predicate: receives a function that evaluates each
  // entity and returns all matching entities (also as copies).
  findByCriteria(predicate: (entity: T) => boolean): T[] {
    return this.entities.filter(predicate).map((entity: T): T => ({ ...entity }));
  }
}
