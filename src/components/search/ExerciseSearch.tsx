import React, { useState } from "react";
import type { DayOfWeek, MuscleGroup } from "../../types/enums";
import type { ExternalExerciseValidation } from "../../types/models";
import type { ExerciseSearchProps } from "../../types/forms";
import { searchExercisesByMuscle, ExerciseApiError } from "../../services/exerciseApi";
import { validateExternalExercise } from "../../utils/calculations";
import { useUserStore } from "../../store/userStore";
import "./ExerciseSearch.css";

const MUSCLE_GROUPS: MuscleGroup[] = [
  "abdominals", "abductors", "adductors", "biceps", "calves", "chest",
  "forearms", "glutes", "hamstrings", "lats", "lower_back", "middle_back",
  "neck", "quadriceps", "traps", "triceps",
];

const DAYS: DayOfWeek[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

type SearchStatus = "idle" | "loading" | "success" | "error";

export const ExerciseSearch = ({ localCatalogCount }: ExerciseSearchProps): React.JSX.Element => {
  const { addExercise } = useUserStore();
  const [muscle, setMuscle] = useState<MuscleGroup>("chest");
  const [day, setDay] = useState<DayOfWeek>("Monday");
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [results, setResults] = useState<ExternalExerciseValidation[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const accepted = results.filter((result: ExternalExerciseValidation): boolean => result.valid);
  const incomplete = results.filter((result: ExternalExerciseValidation): boolean => !result.valid);
  const addedFromApiCount = accepted.filter((result: ExternalExerciseValidation): boolean =>
    result.exercise !== null && addedIds.has(result.exercise.id)
  ).length;

  const handleSearch = async (): Promise<void> => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const raw = await searchExercisesByMuscle(muscle);
      setResults(raw.map(validateExternalExercise));
      setAddedIds(new Set());
      setStatus("success");
    } catch (error) {
      const message = error instanceof ExerciseApiError
        ? error.message
        : "Ocurrió un error inesperado al buscar ejercicios.";
      setErrorMessage(message);
      setResults([]);
      setStatus("error");
    }
  };

  const handleAdd = (validation: ExternalExerciseValidation): void => {
    const { exercise } = validation;
    if (exercise === null) return;
    addExercise(day, exercise);
    setAddedIds((prev: Set<string>): Set<string> => new Set(prev).add(exercise.id));
  };

  return (
    <div className="exercise-search">
      <h2>🌐 Buscar ejercicios (API externa)</h2>

      <div className="exercise-search-controls">
        <div className="form-group">
          <label>Grupo muscular</label>
          <select value={muscle} onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
            const value = e.target.value;
            const match = MUSCLE_GROUPS.find((group: MuscleGroup): boolean => group === value);
            if (match !== undefined) setMuscle(match);
          }}>
            {MUSCLE_GROUPS.map((group: MuscleGroup) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Día para agregar</label>
          <select value={day} onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
            const value = e.target.value;
            const match = DAYS.find((d: DayOfWeek): boolean => d === value);
            if (match !== undefined) setDay(match);
          }}>
            {DAYS.map((d: DayOfWeek) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <button type="button" className="submit-btn" onClick={(): void => { void handleSearch(); }} disabled={status === "loading"}>
          {status === "loading" ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {status === "error" && (
        <p className="exercise-search-error">⚠️ {errorMessage} — el catálogo local sigue disponible normalmente.</p>
      )}

      {status === "success" && (
        <div className="exercise-search-results">
          <h3>📊 Resultados de búsqueda, muscle: {muscle}</h3>

          <div className="exercise-search-group">
            <h4>✅ Válidos ({accepted.length})</h4>
            {accepted.length === 0 ? (
              <p className="category-empty">Sin resultados válidos para este grupo muscular.</p>
            ) : (
              accepted.map((result: ExternalExerciseValidation, index: number) => {
                const isAdded = result.exercise !== null && addedIds.has(result.exercise.id);
                return (
                  <div key={index} className="exercise-search-row">
                    <span>{result.raw.name} · {result.exercise?.type} {isAdded ? "| agregado" : ""}</span>
                    <button
                      type="button"
                      className="submit-btn submit-btn--small"
                      disabled={isAdded}
                      onClick={(): void => handleAdd(result)}
                    >
                      {isAdded ? "✅ Agregado" : "Agregar al catálogo"}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="exercise-search-group">
            <h4>⚠️ Datos incompletos ({incomplete.length})</h4>
            {incomplete.map((result: ExternalExerciseValidation, index: number) => (
              <div key={index} className="exercise-search-row exercise-search-row--incomplete">
                <span>{result.raw.name || "(sin nombre)"} · faltan: {result.missingFields.join(", ")}</span>
              </div>
            ))}
          </div>

          <p className="exercise-search-summary">
            Catálogo local: {localCatalogCount} ejercicios | Desde API: {addedFromApiCount} ejercicios
          </p>
        </div>
      )}
    </div>
  );
};
