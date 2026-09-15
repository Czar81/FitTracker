import type { ExternalExerciseRaw } from "../types/models";
import type { MuscleGroup } from "../types/enums";

const API_BASE_URL = "https://api.api-ninjas.com/v1/exercises";

// La clave nunca se escribe en el código: se lee de la variable de entorno
// VITE_API_NINJAS_KEY (definida en un .env local, no versionado).
const getApiKey = (): string | undefined => import.meta.env.VITE_API_NINJAS_KEY;

export class ExerciseApiError extends Error {}

// Type guard mínimo para no confiar ciegamente en el JSON que llega de la red.
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isExternalExerciseRawShape = (value: unknown): value is ExternalExerciseRaw => {
  if (!isRecord(value)) return false;
  const candidate = value;
  return (
    typeof candidate.name === "string" &&
    typeof candidate.type === "string" &&
    typeof candidate.muscle === "string" &&
    typeof candidate.difficulty === "string" &&
    typeof candidate.instructions === "string" &&
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
