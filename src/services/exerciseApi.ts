import type { ExternalExerciseRaw } from "../types/models";
import type { MuscleGroup } from "../types/enums";

const API_BASE_URL = "https://api.api-ninjas.com/v1/exercises";

// The key is never written in the source code: it is read from the environment
// variable VITE_API_NINJAS_KEY (defined in a local, untracked .env file).
const getApiKey = (): string | undefined => import.meta.env.VITE_API_NINJAS_KEY;

export class ExerciseApiError extends Error {}

// Minimal type guard so the JSON received from the network is not trusted blindly.
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isExternalExerciseRawShape = (value: unknown): value is ExternalExerciseRaw => {
  if (!isRecord(value)) return false;
  const candidate = value;
  return (
    isNonEmptyString(candidate.name) &&
    isNonEmptyString(candidate.type) &&
    isNonEmptyString(candidate.muscle) &&
    isNonEmptyString(candidate.difficulty) &&
    isNonEmptyString(candidate.instructions) && // 🎯 Fix: rejects empty instructions ("") or whitespace-only values
    (typeof candidate.equipment === "string" || Array.isArray(candidate.equipments))
  );
};

const normalizeEquipment = (value: unknown): string => {
  const record = isRecord(value) ? value : {};
  if (Array.isArray(record.equipments)) {
    return record.equipments
      .filter((item: unknown): item is string => typeof item === "string")
      .join(", ");
  }

  return typeof record.equipment === "string" ? record.equipment : "";
};

export const searchExercisesByMuscle = async (muscle: MuscleGroup): Promise<ExternalExerciseRaw[]> => {
  const apiKey = getApiKey();
  if (apiKey == null || apiKey.trim() === "") {
    throw new ExerciseApiError(
      "No hay una clave configurada para la API de ejercicios (VITE_API_NINJAS_KEY)."
    );
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}?muscle=${encodeURIComponent(muscle)}`, {
      headers: { "X-Api-Key": apiKey },
    });
  } catch {
    throw new ExerciseApiError("No se pudo contactar al servicio externo de ejercicios.");
  }

  if (!response.ok) {
    throw new ExerciseApiError(`El servicio externo respondió con un error (${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new ExerciseApiError("El servicio externo devolvió una respuesta con formato inesperado.");
  }

  return data.map((value: unknown): ExternalExerciseRaw => {
    if (isExternalExerciseRawShape(value)) {
      const record = value;
      return {
        name: record.name,
        type: record.type,
        muscle: record.muscle,
        equipment: normalizeEquipment(record),
        difficulty: record.difficulty,
        instructions: record.instructions,
      };
    }

    const record = isRecord(value) ? value : {};
    return {
      name: typeof record.name === "string" ? record.name : "",
      type: typeof record.type === "string" ? record.type : "",
      muscle: typeof record.muscle === "string" ? record.muscle : "",
      equipment: normalizeEquipment(record),
      difficulty: typeof record.difficulty === "string" ? record.difficulty : "",
      instructions: typeof record.instructions === "string" ? record.instructions : "",
    };
  });
};