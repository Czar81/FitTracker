import type { RoutineEntry } from "../../types/core";
import {
  calcCalories,
  calcPace,
  calcTotalCalories,
  calcAvgCaloriesPerDay,
  formatDuration,
} from "../../utils/calculations";

type ExerciseListProps = {
  entries: RoutineEntry[];
};

const ExerciseList = ({ entries }: ExerciseListProps) => {
  if (entries.length === 0) return null;

  const totalCalories = calcTotalCalories(entries);
  const avgCalories = calcAvgCaloriesPerDay(entries);

  return (
    <div className="exercise-list">
      <h2>Ejercicios registrados</h2>
      <div className="exercise-table">
        {entries.map((entry, index) => {
          const calories = calcCalories(
            entry.exercise.durationMinutes,
            entry.exercise.caloriesPerMinute
          );

          return (
            <div key={index} className="exercise-row">
              <span className="exercise-name">{entry.exercise.name}</span>
              <span className="exercise-day">{entry.day}</span>
              <span className="exercise-duration">
                {formatDuration(entry.exercise.durationMinutes)}
              </span>
              {entry.exercise.distanceKm != null && (
                <span className="exercise-pace">
                  Ritmo: {calcPace(entry.exercise.durationMinutes, entry.exercise.distanceKm)} min/km
                </span>
              )}
              {entry.exercise.distanceKm == null && (
                <span className="exercise-pace exercise-pace--empty">—</span>
              )}
              <span className="exercise-calories">{calories} cal</span>
            </div>
          );
        })}
      </div>
      <div className="exercise-totals">
        <span>Total: <strong>{totalCalories} cal</strong></span>
        <span>Promedio por día: <strong>{avgCalories} cal</strong></span>
      </div>
    </div>
  );
};

export default ExerciseList;
