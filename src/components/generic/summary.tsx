import type { RoutineEntry } from "../../types/core";
import { calcCalories, calcTotalCalories, findBestCalorieDay } from "../../utils/calculations";

type SummaryProps = {
  entries: RoutineEntry[];
};

const Summary = ({ entries }: SummaryProps) => {
  if (entries.length === 0) return null;

  const totalCalories = calcTotalCalories(entries);

  const longestExercise = entries.reduce((max, entry) =>
    entry.exercise.durationMinutes > max.exercise.durationMinutes ? entry : max
  );

  const mostCalories = entries.reduce((max, entry) =>
    calcCalories(entry.exercise.durationMinutes, entry.exercise.caloriesPerMinute) >
    calcCalories(max.exercise.durationMinutes, max.exercise.caloriesPerMinute)
      ? entry
      : max
  );

  const mostCaloriesAmount = calcCalories(
    mostCalories.exercise.durationMinutes,
    mostCalories.exercise.caloriesPerMinute
  );

  const percentage = Math.round((mostCaloriesAmount / totalCalories) * 100);

  // Bonus: día con más calorías
  const bestDay = findBestCalorieDay(entries);

  return (
    <div className="summary-box">
      <h2>Resumen comparativo</h2>
      <div className="summary-row">
        <span className="summary-label">Mayor duración:</span>
        <span className="summary-value">
          {longestExercise.exercise.name} ({longestExercise.exercise.durationMinutes} min)
        </span>
      </div>
      <div className="summary-row">
        <span className="summary-label">Más calorías:</span>
        <span className="summary-value">
          {mostCalories.exercise.name} ({mostCaloriesAmount} cal, {percentage}% del total)
        </span>
      </div>
      {bestDay != null && (
        <div className="summary-row">
          <span className="summary-label">Mejor día:</span>
          <span className="summary-value">
            {bestDay.day} — {bestDay.exercise.name} (
            {calcCalories(bestDay.exercise.durationMinutes, bestDay.exercise.caloriesPerMinute)} cal)
          </span>
        </div>
      )}
    </div>
  );
};

export default Summary;
