import type { RoutineEntry, SummaryProps } from "../../types/core";
import { calcCalories, calcTotalCalories, findBestCalorieDay } from "../../utils/calculations";

const Summary = ({ entries }: SummaryProps) => {
  if (entries.length === 0) return null;

  const totalCalories = calcTotalCalories(entries);

  const longestExercise = entries.reduce((max: RoutineEntry, entry: RoutineEntry): RoutineEntry =>
    entry.exercise.durationMinutes > max.exercise.durationMinutes ? entry : max
  );

  const bestDay = findBestCalorieDay(entries);

  const bestDayCalories = bestDay
    ? entries
        .filter((e: RoutineEntry): boolean => e.day === bestDay)
        .reduce((total: number, e: RoutineEntry): number =>
          total + calcCalories(e.exercise.durationMinutes, e.exercise.caloriesPerMinute), 0)
    : 0;

  return (
    <div className="summary-box">
      <h2>Resumen comparativo</h2>
      <div className="summary-row">
        <span className="summary-label">Total de calorías:</span>
        <span className="summary-value">
          <strong>{totalCalories} cal</strong>
        </span>
      </div>
      <div className="summary-row">
        <span className="summary-label">Mayor duración:</span>
        <span className="summary-value">
          {longestExercise.exercise.name} ({longestExercise.exercise.durationMinutes} min)
        </span>
      </div>
      {bestDay != null && (
        <div className="summary-row">
          <span className="summary-label">Mejor día:</span>
          <span className="summary-value">
            {bestDay} ({bestDayCalories} cal)
          </span>
        </div>
      )}
    </div>
  );
};

export default Summary;
