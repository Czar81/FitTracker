import type { RoutineEntry } from "../../types/models";
import type { ExerciseListProps } from "../../types/forms";
import {
  calcCalories,
  calcPace,
  calcTotalCalories,
  calcAvgCaloriesPerDay,
  formatDuration,
} from "../../utils/calculations";

const ExerciseList = ({ entries }: ExerciseListProps) => {
  if (entries.length === 0) return null;

  const totalCalories = calcTotalCalories(entries);
  const avgCalories = calcAvgCaloriesPerDay(entries);

  return (
    <div className="exercise-list">
      <h2>Ejercicios registrados</h2>
      <div className="exercise-table">
        {entries.map((entry: RoutineEntry, index: number) => {
          const calories = calcCalories(
            entry.exercise.durationMinutes,
            entry.exercise.caloriesPerMinute
          );

          const percentage = totalCalories > 0 
            ? Math.round((calories / totalCalories) * 100) 
            : 0;

          return (
            <div key={index} className="exercise-row">
              <span className="exercise-name">{entry.exercise.name}</span>
              <span className="exercise-day">{entry.day}</span>
              <span className="exercise-duration">
                {formatDuration(entry.exercise.durationMinutes)}
              </span>
              
              <span className="exercise-pace">
                {entry.exercise.type === "Cardio"
                  ? `Ritmo: ${calcPace(entry.exercise.durationMinutes, entry.exercise.distanceKm)} min/km`
                  : "—"}
              </span>

              <span className="exercise-calories">{calories} cal</span>
              <span className="exercise-percentage">{percentage}%</span>
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